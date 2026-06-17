# Thingz Low-Cost AWS + ArgoCD Deployment

이 문서는 비용을 낮게 유지하면서 Thingz를 AWS EC2와 ArgoCD로 배포하기 위한 기준안입니다.

## 목표 아키텍처

```text
GitHub
  -> Jenkins: Docker image build/push
  -> ArgoCD: k8s/base sync

EC2 app node
  - k3s
  - ArgoCD
  - nginx ingress controller
  - cert-manager
  - thingz-backend
  - thingz-frontend
  - redis

EC2 db node
  - MySQL 8
  - EBS gp3 data volume
  - S3 mysqldump backup
```

## 추천 최소 인스턴스

| 역할 | 추천 | 메모 |
| --- | --- | --- |
| app EC2 | t3.small 또는 t4g.small | k3s + ArgoCD + 앱 2개 + redis를 한 노드에 올리려면 2GB 이상 권장 |
| db EC2 | t3.micro 또는 t4g.micro | MySQL만 단독 실행. 트래픽이 늘면 DB부터 증설 |
| DB EBS | gp3 20-30GB | MySQL 데이터 전용 볼륨 |

> 완전 최저가만 보면 app/db를 한 EC2에 합칠 수 있지만, 배포 장애와 DB 장애가 같이 묶여서 운영 리스크가 큽니다.

## 보안 그룹

### app EC2

Inbound:
- 22/tcp: 내 IP만
- 80/tcp: 0.0.0.0/0
- 443/tcp: 0.0.0.0/0

Outbound:
- 전체 허용

### db EC2

Inbound:
- 22/tcp: 내 IP만
- 3306/tcp: app EC2 security group만 허용

Outbound:
- 전체 허용

DB는 public 3306을 열지 않습니다.

## DB EC2 초기 세팅

```bash
sudo apt update
sudo apt install -y mysql-server awscli
sudo systemctl enable --now mysql
```

EBS 볼륨을 `/var/lib/mysql`로 붙일 경우, MySQL 정지 후 데이터 디렉터리를 이전합니다.

```bash
sudo systemctl stop mysql
sudo mkfs.ext4 /dev/nvme1n1
sudo mkdir -p /mnt/mysql
sudo mount /dev/nvme1n1 /mnt/mysql
sudo rsync -a /var/lib/mysql/ /mnt/mysql/
sudo mv /var/lib/mysql /var/lib/mysql.bak
sudo mkdir /var/lib/mysql
sudo mount /dev/nvme1n1 /var/lib/mysql
sudo chown -R mysql:mysql /var/lib/mysql
sudo systemctl start mysql
```

`/etc/fstab`에는 실제 UUID를 넣습니다.

```bash
sudo blkid /dev/nvme1n1
sudo vi /etc/fstab
```

예시:

```text
UUID=replace-with-real-uuid /var/lib/mysql ext4 defaults,nofail 0 2
```

DB와 사용자를 생성합니다.

```sql
CREATE DATABASE plateer_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'thingz'@'%' IDENTIFIED BY 'replace-strong-password';
GRANT ALL PRIVILEGES ON plateer_portfolio.* TO 'thingz'@'%';
FLUSH PRIVILEGES;
```

`/etc/mysql/mysql.conf.d/mysqld.cnf`에서 private network 접근이 가능하도록 설정합니다.

```text
bind-address = 0.0.0.0
```

## DB 백업

S3 버킷 예시:

```text
s3://thingz-db-backups/mysql/
```

백업 스크립트 예시:

```bash
sudo mkdir -p /opt/thingz
sudo vi /opt/thingz/mysql-backup.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/tmp/thingz-db-backup"
STAMP="$(date +%Y%m%d-%H%M%S)"
S3_URI="s3://thingz-db-backups/mysql"

mkdir -p "$BACKUP_DIR"
mysqldump \
  --single-transaction \
  --routines \
  --triggers \
  -u thingz \
  -p"${MYSQL_PASSWORD}" \
  plateer_portfolio \
  | gzip > "${BACKUP_DIR}/plateer_portfolio-${STAMP}.sql.gz"

aws s3 cp "${BACKUP_DIR}/plateer_portfolio-${STAMP}.sql.gz" "${S3_URI}/"
find "$BACKUP_DIR" -type f -mtime +2 -delete
```

cron 예시:

```bash
sudo chmod +x /opt/thingz/mysql-backup.sh
sudo crontab -e
```

```text
15 3 * * * MYSQL_PASSWORD='replace-strong-password' /opt/thingz/mysql-backup.sh >> /var/log/thingz-db-backup.log 2>&1
```

## App EC2 k3s 설치

```bash
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
```

nginx ingress controller:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.2/cert-manager.yaml
```

ClusterIssuer 예시:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: replace@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

## ArgoCD 설치

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f argocd/thingz-application.yaml
```

초기 비밀번호:

```bash
argocd admin initial-password -n argocd
```

운영에서는 ArgoCD UI를 public으로 바로 열지 말고, 처음에는 port-forward로 접근합니다.

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Secret 적용

`k8s/base/secret.example.yaml`을 복사해서 실제 Secret을 만든 뒤, 민감 값은 Git에 올리지 않습니다.

```bash
cp k8s/base/secret.example.yaml /tmp/thingz-secret.yaml
vi /tmp/thingz-secret.yaml
kubectl apply -f /tmp/thingz-secret.yaml
rm /tmp/thingz-secret.yaml
```

장기적으로는 Sealed Secrets 또는 External Secrets를 사용합니다.

## Jenkins GitOps 전환

현재 Jenkinsfile은 Docker Compose 배포를 유지합니다. `PUSH_TO_GHCR` 파라미터를 켠 빌드에서는 GHCR에도 이미지를 push합니다.

Jenkins credential:
- `GHCR_CREDENTIALS`: GitHub username + package write 권한이 있는 PAT
- `NEXT_PUBLIC_API_BASE`: frontend build arg
- `THINGZ_ENV_FILE`: 현재 Docker Compose 배포용 `.env`

ArgoCD로 완전히 전환할 때 Jenkins는 다음만 담당하게 만듭니다.

1. checkout
2. backend/frontend Docker build
3. image registry push
4. `k8s/base/kustomization.yaml` 또는 overlay의 image tag 갱신
5. Git push

배포는 ArgoCD가 Git 변경을 감지해서 수행합니다.

이미지 registry 후보:
- GHCR: GitHub repo와 붙이기 쉬움
- ECR: AWS IAM과 붙이기 좋음
- Docker Hub: 가장 단순하지만 rate limit 고려

## 배포 전 체크리스트

- [ ] `k8s/base/configmap.yaml`의 `DB_HOST`, `FRONTEND_URL`, `KAKAO_REDIRECT_URI` 수정
- [ ] `k8s/base/ingress.yaml`의 `thingz.example.com`을 실제 도메인으로 수정
- [ ] `k8s/base/backend.yaml`, `frontend.yaml`의 image registry 수정
- [ ] `thingz-secrets`를 클러스터에 생성
- [ ] 카카오 개발자 콘솔 redirect URI 등록
- [ ] S3 CORS 설정 확인
- [ ] DB EC2 3306 inbound가 app EC2 security group에만 열렸는지 확인
- [ ] DB 백업이 S3에 올라가는지 복원 테스트
