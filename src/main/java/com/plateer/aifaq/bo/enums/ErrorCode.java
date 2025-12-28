package com.plateer.aifaq.bo.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 공통
    INVALID_REQUEST(400, "C001", "잘못된 요청입니다."),
    RESOURCE_NOT_FOUND(404, "C002", "리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(500, "C003", "서버 내부 오류가 발생했습니다."),
    DATABASE_ERROR(1000, "C004", "데이터베이스 연결 확인이 필요합니다."),

    // FAQ 관련
    FAQ_NOT_FOUND(404, "F001", "FAQ 정보를 찾을 수 없습니다."),
    FAQ_DETAIL_NOT_FOUND(404, "F002", "FAQ 상세 정보를 찾을 수 없습니다."),
    GOODS_NOT_FOUND(404, "F003", "상품 정보를 찾을 수 없습니다."),
    FAQ_UPDATE_FAILED(500, "F004", "FAQ 업데이트에 실패했습니다."),
    FAQ_INSERTED_FAILED(500, "F005", "FAQ 정보 등록에 실패했습니다."),

    // program 관련
    PGM_END_DATE_UPDATED_FAILED(500, "P001", "프로그램을 종료 할 수 없습니다."),
    PGM_RESOURCE_NOT_FOUND(500, "P002", "현재 실행중인 프로그램을 찾을 수 없습니다."),
    PGM_ALREADY_STARTED(500, "P003", "잔행중인 프로그램을 종료 후 실행해주세요");

    private final int status;
    private final String code;
    private final String message;
}
