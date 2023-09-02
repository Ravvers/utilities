export type ErrorMessages = {
	[key: string]: string;
};

export interface CustomErrorObject<T> {
	message: T[keyof T];
	errorType: string;
}

export class CustomErrorGenerator<T extends ErrorMessages> {
	name: string;
	errorMessages: T;
	constructor(name: string, errorMessages: T) {
		this.name = name;
		this.errorMessages = errorMessages;
	}

	newError(errorKey: keyof T): CustomErrorObject<T> {
		return {
			message: this.errorMessages[errorKey],
			errorType: this.name
		};
	}
}

export function getIsOkFunction(
	_errors: CustomErrorGenerator<ErrorMessages>[]
) {
	function isError<Value>(
		validatedValue: Value | CustomErrorObject<ErrorMessages>
	): validatedValue is CustomErrorObject<ErrorMessages> {
		return (
			(validatedValue as CustomErrorObject<ErrorMessages>).errorType !==
			undefined
		);
	}

	return function ok<Value>(
		validatedValue: Value | CustomErrorObject<ErrorMessages>
	): validatedValue is Value {
		if (validatedValue === null || validatedValue === undefined) {
			return true;
		}
		return !isError(validatedValue);
	};
}
