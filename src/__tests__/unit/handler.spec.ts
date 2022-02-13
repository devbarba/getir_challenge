import {
    NOT_FOUND,
    BAD_REQUEST,
    CONFLICT,
    PRECONDITION_FAILED,
    PERMANENT_REDIRECT,
} from 'http-status';

import Handler from '../../errors/handler.error';

describe('Testing error handling functions', () => {
    test('expect return error calling Handler', () => {
        expect(() => {
            throw new Handler(
                'handling error for testing purpouses',
                10001,
                NOT_FOUND
            );
        }).toThrow('handling error for testing purpouses');
        expect.assertions(1);
    });

    test('expect return error message when call Handler.getMessage()', () => {
        const error = new Handler('getting error message', 10002, CONFLICT);

        expect(error.getMessage()).toEqual('getting error message');
        expect.assertions(1);
    });

    test('expect return error status_code when call Handler.getStatusCode()', () => {
        const error = new Handler('getting status_code', 1003, BAD_REQUEST);

        expect(error.getStatusCode()).toEqual(BAD_REQUEST);
        expect.assertions(1);
    });

    test('expect return error other errors when call Handler.getErrors()', () => {
        const error = new Handler(
            'getting other errors',
            1004,
            PRECONDITION_FAILED
        );

        error.setErrors(['Unexpected token } in JSON at position 2022']);
        expect(error.getErrors()).toEqual([
            'Unexpected token } in JSON at position 2022',
        ]);
        expect.assertions(1);
    });

    test('expect return error code when call Handler.getCode()', () => {
        const error = new Handler(
            'getting other errors',
            1005,
            PERMANENT_REDIRECT
        );

        expect(error.getCode()).toEqual(1005);
        expect.assertions(1);
    });
});
