package com.plateer.aifaq.bo.aspect;

import com.plateer.aifaq.bo.enums.ErrorCode;
import com.plateer.aifaq.bo.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

/**
 * 서비스 레이어 예외 처리 AOP
 * - 모든 Service 메소드의 예외를 가로채서 처리
 * - 기술적 예외(DB 등)를 비즈니스 예외로 변환
 */
@Slf4j
@Aspect
@Component
@Order(1)  // GlobalExceptionHandler보다 먼저 실행
public class ServiceExceptionAspect {

    /**
     * 모든 ServiceImpl 클래스의 메소드에 적용
     * execution(* com.plateer.aifaq.bo.service.*ServiceImpl.*(..))
     * - 첫번째 *: 모든 반환 타입
     * - *ServiceImpl: ServiceImpl로 끝나는 모든 클래스
     * - *(..): 모든 메소드, 모든 파라미터
     */
    @Around("execution(* com.plateer.aifaq.bo.service.*ServiceImpl.*(..))")
    public Object handleServiceException(ProceedingJoinPoint joinPoint) throws Throwable {

        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        try {
            // 메소드 실행 전 로깅
            log.debug("[{}#{}] 시작 - 파라미터: {}", className, methodName, args);

            // 실제 메소드 실행
            Object result = joinPoint.proceed();

            // 메소드 실행 후 로깅
            log.debug("[{}#{}] 완료", className, methodName);

            return result;

        } catch (BusinessException e) {
            // 비즈니스 예외는 그대로 전파 (GlobalExceptionHandler가 처리)
            log.warn("[{}#{}] 비즈니스 예외 발생: {} - {}",
                    className, methodName, e.getErrorCode().getCode(), e.getMessage());
            throw e;

        } catch (DataAccessException e) {
            // 데이터베이스 예외를 비즈니스 예외로 변환
            log.error("[{}#{}] 데이터베이스 예외 발생", className, methodName, e);
            throw new BusinessException(
                    ErrorCode.DATABASE_ERROR,
                    "데이터 처리 중 오류가 발생했습니다: " + e.getMessage()
            );

        } catch (Exception e) {
            // 예상치 못한 예외
            log.error("[{}#{}] 예상치 못한 예외 발생", className, methodName, e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
