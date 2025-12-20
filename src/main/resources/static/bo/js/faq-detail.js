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
                const response = await axios.get(`/api/faq/dtl/${this.faqId}`);
                this.details = response.data || [];

            } catch (error) {
                this.details = [];
                alert('FAQ 상세를 불러오는데 실패했습니다.\n' +
                    (error.response?.data?.message || error.message));
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
        },

        getDisplayCount(dispYn) {
            return this.details.filter(detail => detail.dispYn === dispYn).length;
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