import {
	CustomErrorGenerator,
	ErrorMessages,
	getIsOkFunction
} from "./CustomErrorGenerator";
import { describe, expect, it } from "vitest";

const errors: ErrorMessages = {
	ERROR_1: "Error 1",
	ERROR_2: "Error 2"
};

const validationErrors: ErrorMessages = {
	VALIDATION_ERROR_1: "Validation Error 1",
	VALIDATION_ERROR_2: "Validation Error 2"
};

describe("CustomErrorGenerator.ts", () => {
	describe("CustomErrorGenerator", () => {
		it("should create a CustomErrorGenerator", () => {
			const customErrorGenerator = new CustomErrorGenerator(
				"CustomErrorGenerator",
				errors
			);
			expect(customErrorGenerator).toBeDefined();
		});
		it("should return the correct error object", () => {
			const customErrorGenerator = new CustomErrorGenerator(
				"CustomErrorGenerator",
				errors
			);
			expect(customErrorGenerator.newError("ERROR_1")).toEqual({
				message: "Error 1",
				errorType: "CustomErrorGenerator"
			});
		});
	});
	describe("getIsOkFunction", () => {
		it("should return a function", () => {
			const errorGenerators = [
				new CustomErrorGenerator("CustomErrorGenerator", errors),
				new CustomErrorGenerator(
					"ValidationErrorGenerator",
					validationErrors
				)
			];
			const isOk = getIsOkFunction(errorGenerators);
			expect(isOk).toBeDefined();
		});
		it("returned function should return false for a custom generated error", () => {
			const customErrorGenerator = new CustomErrorGenerator(
				"CustomErrorGenerator",
				errors
			);
			const validationErrorGenerator = new CustomErrorGenerator(
				"ValidationErrorGenerator",
				validationErrors
			);
			const errorGenerators = [
				customErrorGenerator,
				validationErrorGenerator
			];
			const isOk = getIsOkFunction(errorGenerators);
			expect(isOk).toBeDefined();
			const newValidationError =
				validationErrorGenerator.newError("VALIDATION_ERROR_1");
			expect(isOk(newValidationError)).toBe(false);
			const newCustomError = customErrorGenerator.newError("ERROR_2");
			expect(isOk(newCustomError)).toBe(false);
		});
		it("should return true for a non error", () => {
			const errorGenerators = [
				new CustomErrorGenerator("CustomErrorGenerator", errors),
				new CustomErrorGenerator(
					"ValidationErrorGenerator",
					validationErrors
				)
			];
			const isOk = getIsOkFunction(errorGenerators);
			expect(isOk("1")).toBe(true);
			expect(isOk(1)).toBe(true);
			expect(isOk({})).toBe(true);
			expect(isOk([])).toBe(true);
			expect(isOk(null)).toBe(true);
			expect(isOk(undefined)).toBe(true);
			expect(isOk(false)).toBe(true);
			expect(isOk(true)).toBe(true);
		});
	});
});
