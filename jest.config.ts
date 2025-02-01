import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // next.config.js와 .env 파일이 있는 위치
  dir: "./",
});

const config: Config = {
  roots: ["./src"], // 테스트 파일을 찾을 루트 디렉토리
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // 테스트 실행 전 설정 파일
  testEnvironment: "jsdom", // 브라우저와 유사한 DOM 환경 제공
  preset: "ts-jest", // TypeScript 지원
  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
  },
  // 테스트 대상에서 제외할 경로
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default createJestConfig(config);
