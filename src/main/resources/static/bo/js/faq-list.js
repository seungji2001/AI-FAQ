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
                return new Date(dateString).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch {
                return '-';
            }
        },

        refreshList() {
            this.currentPage = 1;
            this.loadFaqList();
        },

        // ========== 모달 관련 메서드 ==========
        async openSummaryModal() {
            this.showSummaryModal = true;
            this.selectedProgram = null;
            this.programSearch = '';
            await this.loadPrograms();
            document.body.classList.add('modal-open'); // 추가
        },

        closeSummaryModal() {
            this.showSummaryModal = false;
            this.selectedProgram = null;
            this.programSearch = '';
            this.programs = [];
            this.filteredPrograms = [];
            document.body.classList.remove('modal-open'); // 추가
        },

        async loadPrograms() {
            this.loadingPrograms = true;
            try {
                const response = await axios.get('/api/programs/ends');
                this.programs = response.data || [];
                this.filteredPrograms = response.data || [];
                console.log('프로그램 목록 로드 완료:', this.programs.length);
            } catch (error) {
                console.error('프로그램 목록 로드 실패:', error);
                alert('프로그램 목록을 불러오는데 실패했습니다.');
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
                // 기존 API 대신 새로운 API 호출
                const response = await axios.get(`/api/live-start-end/program/${this.selectedProgram.id}/mst-goods`);

                alert('요약 전송이 완료되었습니다.');
                this.closeSummaryModal();
                this.refreshList();

            } catch (error) {
                console.error('요약 전송 실패:', error);

                // 에러 메시지 추출
                let errorMessage = '요약 전송에 실패했습니다.';

                if (error.response) {
                    // 서버에서 반환한 에러 메시지 확인
                    if (error.response.data) {
                        // String으로 온 경우
                        if (typeof error.response.data === 'string') {
                            errorMessage = error.response.data;
                        }
                        // 객체로 온 경우 (message 필드)
                        else if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        }
                        // 그 외의 경우
                        else {
                            errorMessage = JSON.stringify(error.response.data);
                        }
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }

                alert(errorMessage);

            } finally {
                this.sendingRequest = false;
            }
        }
    },
    mounted() {
        this.loadFaqList();
    }
}).mount('#app');