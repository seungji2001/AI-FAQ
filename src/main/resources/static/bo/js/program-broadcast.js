const { createApp } = Vue;

createApp({
    data() {
        return {
            pgmId: null,
            broadcasts: [],
            loading: false
        }
    },
    methods: {
        async loadBroadcasts() {
            if (!this.pgmId) {
                alert('프로그램 ID가 없습니다.');
                return;
            }

            this.loading = true;
            try {
                // TODO: API 엔드포인트 확인 필요
                const response = await axios.get(`/api/live-start-end/program/${this.pgmId}`);
                this.broadcasts = response.data || [];
                console.log('방송 정보 로드:', this.broadcasts.length);
            } catch (error) {
                console.error('방송 정보 로드 실패:', error);
                alert('방송 정보를 불러오는데 실패했습니다.');
            } finally {
                this.loading = false;
            }
        },

        goBack() {
            window.location.href = '/bo/program/list';
        },

        formatDateTime(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleString('ko-KR');
            } catch {
                return '-';
            }
        },

        getPgmIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('pgmId');
        },

        // ⭐ 방송 종료 메서드 추가
        async endBroadcast(broadcast) {
            if (!confirm('방송을 종료하시겠습니까?')) {
                return;
            }

            try {
                const response = await axios.put(`/api/live-start-end/program/${broadcast.pgmId}/fin`);

                if (response.data) {
                    alert('방송이 종료되었습니다.');
                    // 목록 새로고침
                    await this.loadBroadcasts();
                } else {
                    alert('방송 종료에 실패했습니다.');
                }
            } catch (error) {
                console.error('방송 종료 실패:', error);

                let errorMessage = '방송 종료에 실패했습니다.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }

                alert(errorMessage);
            }
        },
    },
    mounted() {
        this.pgmId = this.getPgmIdFromUrl();
        if (this.pgmId) {
            this.loadBroadcasts();
        } else {
            alert('프로그램 ID가 없습니다.');
            this.goBack();
        }
    }
}).mount('#app');