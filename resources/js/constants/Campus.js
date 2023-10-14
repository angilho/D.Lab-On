const Campus = {
	NONE: 0,
	PANGYO: 1,
	DAECHI: 2,
	DAEGU_SUSEONG: 3,
	MOKDONG: 4,
	DONGTAN: 5,
	ULSAN: 6,
	JAMSIL: 7,
	JUNGJA: 8,
	PYEONGCHON: 9,
	SONGDO: 10,
	CHEONGJU: 12,
	DLABON: 11,

	allCampus() {
		return [
			this.NONE,
			this.PANGYO,
			this.DAECHI,
			this.DAEGU_SUSEONG,
			this.MOKDONG,
			this.DONGTAN,
			this.ULSAN,
			this.JAMSIL,
			this.JUNGJA,
			this.PYEONGCHON,
			this.SONGDO,
			this.CHEONGJU,
			this.DLABON
		];
	},

	convertToString(value) {
		switch (value) {
			case this.NONE:
				return "없음";
			case this.PANGYO:
				return "판교캠퍼스";
			case this.DAECHI:
				return "대치캠퍼스";
			case this.DAEGU_SUSEONG:
				return "대구수성캠퍼스";
			case this.MOKDONG:
				return "목동캠퍼스";
			case this.DONGTAN:
				return "동탄캠퍼스";
			case this.ULSAN:
				return "울산캠퍼스";
			case this.JAMSIL:
				return "잠실캠퍼스";
			case this.JUNGJA:
				return "정자캠퍼스";
			case this.PYEONGCHON:
				return "평촌캠퍼스";
			case this.SONGDO:
				return "송도캠퍼스";
			case this.CHEONGJU:
				return "청주캠퍼스";
			case this.DLABON:
				return "디랩온";
		}
		return "";
	}
};

export default Campus;
