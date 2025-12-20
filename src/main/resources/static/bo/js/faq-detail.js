const { createApp } = Vue;

createApp({
    data() {
        return {
            faqId: null,
            details: [],
            loading: false
        }
    },
    methods: {
        async loadDetails() {
            if (!this.faqId) {
                alert('FAQ ID가 없습니다.');
                return;
            }

            this.loading = true;
            try {
                const response = await axios.get(`/api/bo/faq/${this.faqId}/details`);
                this.details = response.data;
                console.log('FAQ 상세 로드 완료:', this.details.length);
            } catch (error) {
                console.error('FAQ 상세 로드 실패:', error);
                alert('FAQ 상세를 불러오는데 실패했습니다.');
            } finally {
                this.loading = false;
            }
        },

        goBack() {
            window.location.href = '/bo/faq/list';
        },

        getFaqIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('faqId');
        }
    },
    mounted() {
        this.faqId = this.getFaqIdFromUrl();
        if (this.faqId) {
            this.loadDetails();
        } else {
            alert('FAQ ID가 없습니다.');
            this.goBack();
        }
    }
}).mount('#app');