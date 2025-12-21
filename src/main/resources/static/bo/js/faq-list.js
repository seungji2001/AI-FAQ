const { createApp } = Vue;

createApp({
    data() {
        return {
            faqList: [],
            filteredFaqList: [],
            searchKeyword: '',
            loading: false,
            currentPage: 1,
            itemsPerPage: 9,

            // 모달 관련
            showSummaryModal: false,
            programs: [],
            filteredPrograms: [],
            programSearch: '',
            selectedProgram: null,
            loadingPrograms: false,
            sendingRequest: false
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
                const response = await axios.get('/api/programs/faq');
                this.faqList = response.data || [];
                this.filteredFaqList = response.data || [];
                console.log('완료된 FAQ 프로그램 로드:', this.faqList.length);
            } catch (error) {
                console.error('FAQ 목록 로드 실패:', error);
                this.faqList = [];
                this.filteredFaqList = [];
            } finally {
                this.loading = false;
            }
        },

        filterFaqs() {
            if (!this.searchKeyword.trim()) {
                this.filteredFaqList = this.faqList;
                return;
            }

            this.filteredFaqList = this.faqList.filter(program =>
                program.pgmNm.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );
            this.currentPage = 1;
        },

        goToDetail(pgmId) {
            window.location.href = `/bo/faq/detail?pgmId=${pgmId}`;
        },

        refreshList() {
            this.currentPage = 1;
            this.loadFaqList();
        },

        // ========== 요약전송 모달 ==========
        async openSummaryModal() {
            this.showSummaryModal = true;
            this.selectedProgram = null;
            this.programSearch = '';
            document.body.classList.add('modal-open');
            await this.loadPrograms();
        },

        closeSummaryModal() {
            this.showSummaryModal = false;
            this.selectedProgram = null;
            this.programSearch = '';
            this.programs = [];
            this.filteredPrograms = [];
            document.body.classList.remove('modal-open');
        },

        async loadPrograms() {
            this.loadingPrograms = true;
            try {
                const response = await axios.get('/api/programs/ends');
                this.programs = response.data || [];
                this.filteredPrograms = response.data || [];
                console.log('프로그램 목록 로드:', this.programs.length);
            } catch (error) {
                console.error('프로그램 목록 로드 실패:', error);
                this.programs = [];
                this.filteredPrograms = [];
            } finally {
                this.loadingPrograms = false;
            }
        },

        filterPrograms() {
            if (!this.programSearch.trim()) {
                this.filteredPrograms = this.programs;
                return;
            }

            this.filteredPrograms = this.programs.filter(program =>
                program.pgmNm.toLowerCase().includes(this.programSearch.toLowerCase())
            );
        },

        selectProgram(program) {
            this.selectedProgram = program;
        },

        async sendSummary() {
            if (!this.selectedProgram) {
                alert('프로그램을 선택해주세요.');
                return;
            }

            if (!confirm(`"${this.selectedProgram.pgmNm}" 프로그램의 FAQ 요약을 전송하시겠습니까?`)) {
                return;
            }

            this.sendingRequest = true;
            try {
                const response = await axios.get(`/api/live-start-end/program/${this.selectedProgram.id}/mst-goods`);

                this.closeSummaryModal();
                this.refreshList();

            } catch (error) {
                console.error('요약 전송 실패:', error);

                let errorMessage = '요약 전송에 실패했습니다.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }

                alert(errorMessage);
            } finally {
                this.sendingRequest = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleDateString('ko-KR');
            } catch {
                return '-';
            }
        }
    },
    mounted() {
        this.loadFaqList();
    }
}).mount('#app');