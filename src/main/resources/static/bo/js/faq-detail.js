const { createApp } = Vue;

createApp({
    data() {
        return {
            pgmId: null,
            goodsList: [],
            selectedGoodsId: null,      // 선택된 상품 ID
            selectedFaqSumrId: null,    // 선택된 FAQ 요약 ID
            goodsFaqSumr: {},           // 각 상품의 FAQ 요약 정보
            loadingFaqSumr: {},         // FAQ 요약 로딩 상태
            loading: false
        }
    },
    computed: {
        goodsFaqCount() {
            const counts = {};
            Object.keys(this.goodsFaqSumr).forEach(goodsId => {
                const sumrs = this.goodsFaqSumr[goodsId] || [];
                const totalCount = sumrs.reduce((sum, sumr) => sum + (sumr.details?.length || 0), 0);
                counts[goodsId] = totalCount;
            });
            return counts;
        },

        totalFaqCount() {
            return Object.values(this.goodsFaqSumr)
                .flat()
                .reduce((sum, sumr) => sum + (sumr.details?.length || 0), 0);
        }
    },
    methods: {
        async loadGoods() {
            if (!this.pgmId) {
                alert('프로그램 ID가 없습니다.');
                return;
            }

            this.loading = true;
            try {
                const response = await axios.get(`/api/faq/goods/${this.pgmId}`);
                this.goodsList = response.data || [];
                console.log('상품 목록 로드:', this.goodsList.length);
            } catch (error) {
                console.error('상품 목록 로드 실패:', error);
                alert('상품 목록을 불러오는데 실패했습니다.');
            } finally {
                this.loading = false;
            }
        },

        async selectGoods(goodsId) {
            // 같은 상품 재선택 시 무시
            if (this.selectedGoodsId === goodsId) {
                return;
            }

            this.selectedGoodsId = goodsId;
            this.selectedFaqSumrId = null; // FAQ 요약 선택 초기화

            // FAQ 요약 정보가 없으면 로드
            if (!this.goodsFaqSumr[goodsId]) {
                await this.loadFaqSumr(goodsId);
            } else {
                // 이미 로드된 경우 첫 번째 FAQ 자동 선택
                const sumrs = this.goodsFaqSumr[goodsId];
                if (sumrs && sumrs.length > 0) {
                    this.selectedFaqSumrId = sumrs[0].id;
                }
            }
        },

        selectFaqSumr(sumrId) {
            this.selectedFaqSumrId = sumrId;
        },

        async loadFaqSumr(goodsId) {
            this.loadingFaqSumr[goodsId] = true;
            try {
                const response = await fetch('/api/faq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pgmId: this.pgmId,
                        goodsId: goodsId
                    })
                });

                const data = await response.json();

                if (data && data.length > 0) {
                    // 각 요약에 대한 상세 정보를 함께 저장
                    const sumrWithDetails = [];

                    for (const sumr of data) {
                        const details = await this.fetchFaqDetails(sumr.id);
                        sumrWithDetails.push({
                            ...sumr,
                            details: details  // 요약에 상세 정보 추가
                        });
                    }

                    this.goodsFaqSumr[goodsId] = sumrWithDetails;

                    // 첫 번째 FAQ 자동 선택
                    if (sumrWithDetails.length > 0) {
                        this.selectedFaqSumrId = sumrWithDetails[0].id;
                    }
                } else {
                    console.warn(`상품 ${goodsId}에 대한 FAQ 요약 정보가 없습니다.`);
                    this.goodsFaqSumr[goodsId] = [];
                }
            } catch (error) {
                console.error('FAQ 요약 로드 실패:', error);
                this.goodsFaqSumr[goodsId] = [];
            } finally {
                this.loadingFaqSumr[goodsId] = false;
            }
        },

        async fetchFaqDetails(faqId) {
            try {
                const response = await axios.get(`/api/faq/dtl/${faqId}`);
                return response.data || [];
            } catch (error) {
                console.error(`FAQ ${faqId} 상세 로드 실패:`, error);
                return [];
            }
        },

        getSelectedFaqDetails() {
            if (!this.selectedGoodsId || !this.selectedFaqSumrId) {
                return [];
            }

            const sumrs = this.goodsFaqSumr[this.selectedGoodsId] || [];
            const selectedSumr = sumrs.find(s => s.id === this.selectedFaqSumrId);
            return selectedSumr?.details || [];
        },

        goBack() {
            window.location.href = '/bo/faq/list';
        },

        getPgmIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('pgmId');
        },

        formatPrice(price) {
            if (!price) return '0';
            return price.toLocaleString('ko-KR');
        },

        formatDateTime(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleString('ko-KR');
            } catch {
                return '-';
            }
        },

        getStatusText(status) {
            const statusMap = { 'W': '대기', 'A': '완료', 'F': '실패' };
            return statusMap[status] || '알 수 없음';
        },

        getStatusClass(status) {
            const classMap = { 'W': 'waiting', 'A': 'success', 'F': 'fail' };
            return classMap[status] || 'unknown';
        },
        async toggleDispYn(faq, goodsId) {
            // 현재 상태의 반대로 변경
            const newDispYn = faq.dispYn === 'Y' ? 'N' : 'Y';

            try {
                const response = await axios.post('/api/faq/dispYn', {
                    faqDtlId: faq.id,
                    dispYn: newDispYn
                });

                // 성공하면 로컬 데이터 업데이트
                faq.dispYn = newDispYn;

                console.log(`FAQ ${faq.id} 노출 상태 변경: ${newDispYn}`);

                // 선택적: 성공 메시지 표시
                // alert(`${newDispYn === 'Y' ? '노출' : '비노출'}로 변경되었습니다.`);

            } catch (error) {
                console.error('노출 상태 변경 실패:', error);
                alert('노출 상태 변경에 실패했습니다.');
            }
        },
    },
    mounted() {
        this.pgmId = this.getPgmIdFromUrl();
        if (this.pgmId) {
            this.loadGoods();
        } else {
            alert('프로그램 ID가 없습니다.');
            this.goBack();
        }
    }
}).mount('#app');