const { createApp } = Vue;

createApp({
    data() {
        return {
            faqList: [],
            filteredFaqList: [],
            searchKeyword: '',
            filterStatus: '',
            loading: false,
            currentPage: 1,
            itemsPerPage: 9
        }
    },
    computed: {
        paginatedFaqList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredFaqList.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredFaqList.length / this.itemsPerPage) || 1;
        }
    },
    methods: {
        async loadFaqList() {
            this.loading = true;
            try {
                const response = await axios.get('/api/faq');
                this.faqList = response.data || [];
                this.filteredFaqList = response.data || [];
            } catch (error) {
                console.error('FAQ 목록 로드 실패:', error);
                this.faqList = [];
                this.filteredFaqList = [];
            } finally {
                this.loading = false;
            }
        },

        filterFaqs() {
            let filtered = this.faqList;

            if (this.searchKeyword.trim()) {
                filtered = filtered.filter(faq =>
                    String(faq.pgmId || '').includes(this.searchKeyword)
                );
            }

            if (this.filterStatus) {
                filtered = filtered.filter(faq =>
                    faq.linkStatus === this.filterStatus
                );
            }

            this.filteredFaqList = filtered;
            this.currentPage = 1;
        },

        goToDetail(faqId) {
            window.location.href = `/bo/faq/detail?faqId=${faqId}`;
        },

        async generateFaq(pgmId) {
            alert('기능 준비중입니다.');
        },

        getStatusCount(status) {
            return this.faqList.filter(faq => faq.linkStatus === status).length;
        },

        getStatusText(status) {
            const statusMap = { 'A': '완료', 'F': '실패', 'W': '대기' };
            return statusMap[status] || '알 수 없음';
        },

        getStatusClass(status) {
            const classMap = { 'A': 'success', 'F': 'fail', 'W': 'wait' };
            return classMap[status] || 'unknown';
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleString('ko-KR');
            } catch {
                return '-';
            }
        },

        refreshList() {
            this.currentPage = 1;
            this.loadFaqList();
        }
    },
    mounted() {
        this.loadFaqList();
    }
}).mount('#app');