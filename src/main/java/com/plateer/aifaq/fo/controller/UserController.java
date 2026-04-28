package com.plateer.aifaq.fo.controller;

import com.plateer.aifaq.fo.dto.UserDto;
import com.plateer.aifaq.fo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User", description = "유저 API")
@RestController
@RequestMapping("/api/fo/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Operation(
        summary = "활성 유저 목록 조회",
        description = "isActive=true인 유저 목록을 반환합니다. 오늘의 에디터 섹션에서 사용됩니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "조회 성공",
                content = @Content(schema = @Schema(implementation = UserDto.class)))
        }
    )
    @GetMapping
    public ResponseEntity<List<UserDto>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }
}
