type OwnMatcher<Params extends unknown[]> = (
    this: jest.MatcherContext,
    actual: unknown,
    ...params: Params
) => jest.CustomMatcherResult;

declare global {
    namespace jest {
        interface JestMatchers<R> {
            // Public signature
            toBeCloseToArray(arr: number[]): CustomMatcherResult;
        }

        interface ExpectExtendMap {
            // Here, we're describing the call signature of our matcher for the "expect.extend()" call.
            toBeCloseToArray: OwnMatcher<[arr: number[]]>
        }
    }
};
