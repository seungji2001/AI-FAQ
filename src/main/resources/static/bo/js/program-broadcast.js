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
        }
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