const { createApp } = Vue;

createApp({
    data() {
        return {
            programs: [],
            loading: false,

            // 모달 관련
            showGoodsModal: false,
            selectedProgram: null,
            goods: [],
            filteredGoods: [],
            goodsSearch: '',
            selectedGoods: [],
            loadingGoods: false,
            startingBroadcast: false
        }
    },
    methods: {
        async loadPrograms() {
            this.loading = true;
            try {
                const response = await axios.get('/api/programs');
                this.programs = response.data || [];
                console.log('프로그램 목록 로드:', this.programs.length);
            } catch (error) {
                console.error('프로그램 목록 로드 실패:', error);
                alert('프로그램 목록을 불러오는데 실패했습니다.');
            } finally {
                this.loading = false;
            }
        },

        refreshList() {
            this.loadPrograms();
        },

        async selectProgram(program) {
            this.selectedProgram = program;
            this.selectedGoods = [];
            this.goodsSearch = '';
            this.showGoodsModal = true;
            document.body.classList.add('modal-open');
            await this.loadGoods();
        },

        closeGoodsModal() {
            this.showGoodsModal = false;
            this.selectedProgram = null;
            this.selectedGoods = [];
            this.goods = [];
            this.filteredGoods = [];
            document.body.classList.remove('modal-open');
        },

        async loadGoods() {
            this.loadingGoods = true;
            try {
                const response = await axios.get('/api/goods');
                this.goods = response.data || [];
                this.filteredGoods = response.data || [];
                console.log('상품 목록 로드:', this.goods.length);
            } catch (error) {
                console.error('상품 목록 로드 실패:', error);
                alert('상품 목록을 불러오는데 실패했습니다.');
            } finally {
                this.loadingGoods = false;
            }
        },

        filterGoods() {
            if (!this.goodsSearch.trim()) {
                this.filteredGoods = this.goods;
                return;
            }

            this.filteredGoods = this.goods.filter(goods =>
                goods.goodsNm.toLowerCase().includes(this.goodsSearch.toLowerCase())
            );
        },

        toggleGoods(goods) {
            const index = this.selectedGoods.findIndex(g => g.id === goods.id);
            if (index > -1) {
                this.selectedGoods.splice(index, 1);
            } else {
                this.selectedGoods.push(goods);
            }
        },

        isSelected(goodsId) {
            return this.selectedGoods.some(g => g.id === goodsId);
        },

        async viewCurrentBroadcast() {
            try {
                // 현재 진행중인 방송 조회 API 호출
                const response = await axios.get('/api/live-start-end/current');

                if (response.data && response.data.pgmId) {
                    // 진행중인 방송이 있으면 해당 페이지로 이동
                    window.location.href = `/bo/program/broadcast?pgmId=${response.data.pgmId}`;
                } else {
                    alert('현재 진행중인 방송이 없습니다.');
                }
            } catch (error) {
                console.error('진행중인 방송 조회 실패:', error);
                alert('진행중인 방송 정보를 가져오는데 실패했습니다.');
            }
        },
        
        async startBroadcast() {
            if (this.selectedGoods.length === 0) {
                alert('상품을 선택해주세요.');
                return;
            }

            if (!confirm(`${this.selectedGoods.length}개의 상품으로 방송을 시작하시겠습니까?`)) {
                return;
            }

            this.startingBroadcast = true;
            try {
                const requestData = {  // requestData로 수정 (오타)
                    pgmId: this.selectedProgram.id,
                    goodsId: this.selectedGoods.map(g => g.id)
                };

                const pgmId = this.selectedProgram.id;
                console.log('요청 데이터:', requestData);  // 디버깅용

                const response = await axios.post('/api/live-start-end/insert', requestData);

                console.log('응답:', response);  // 디버깅용

                alert('방송이 시작되었습니다.');
                this.closeGoodsModal();

                // 방송 상세 페이지로 이동
                window.location.href = `/bo/program/broadcast?pgmId=${pgmId}`;

            } catch (error) {
                console.error('방송 시작 실패:', error);

                // 에러 메시지 추출
                let errorMessage = '방송 시작에 실패했습니다.';

                if (error.response?.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }

                alert(errorMessage);
            } finally {
                this.startingBroadcast = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleDateString('ko-KR');
            } catch {
                return '-';
            }
        },

        formatPrice(price) {
            if (!price) return '0';
            return price.toLocaleString('ko-KR');
        }
    },
    mounted() {
        this.loadPrograms();
    }
}).mount('#app');