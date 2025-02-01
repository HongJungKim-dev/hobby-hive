import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "./useIntersectionObserver";

describe("useIntersectionObserver", () => {
  const mockIntersectionObserver = jest.fn();
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    // IntersectionObserver 모의 구현
    mockIntersectionObserver.mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    }));
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not create IntersectionObserver when enabled is false", () => {
    const onIntersect = jest.fn();

    renderHook(() =>
      useIntersectionObserver({
        onIntersect,
        enabled: false,
      })
    );

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });
});
