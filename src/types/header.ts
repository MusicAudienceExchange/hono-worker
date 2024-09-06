import typia from "typia";

/**
 * Used as an intermediary to validate a type. Must be created in the `types.ts` file
 * for each type that is intended to be validated at some point. 
 * 
 * Example usage:
 * ```typescript
 * export interface Foo {
 *  bar: ...;
 *  baz: ...;
 * }
 * 
 * export const Foo: Validatable<Foo> = {
 *  validate: (data: unknown) => typia.validate<Foo>(data),
 * };
 * ```
 */

export type Validatable<T> = (input: unknown) => typia.IValidation<T>;

interface Jsonable {
	json: () => Promise<any>;
}

export const Jsonable = typia.createValidate<Jsonable>();

/**
 * `check` returns a `Typia.IValidation` object, which has `.success` and `.errors` fields.
 * No external use unless custom error-handling is desired. 
 * 
 * @param validatable a validatable object from the `types` directory with a corresponding type
 * @param data an object that has already been parsed (i.e. it does not have a `.json()` method)
 * @returns 
 */
export const check = <T>(data: unknown, validatable: Validatable<T>) => validatable(data);

/**
 * `ensure` acts as a type predicate for already parsed data. 
 * 
 * Example usage: 
 * ``` typescript
 * const data = ...; // some parsed data 
 * if (!ensure(data, Foo)) return error;  // indicates that data is not of type `Foo`
 * const { bar, baz } = data; // data is typed as `Foo`
 * ```
 * 
 * @param data an object that has already been parsed (i.e. it does not have a `.json()` method)
 * @param validatable a validatable object from the `types` directory with a corresponding type
 * @returns `true` if data is of type `T`, `false` otherwise`
 */
export const ensure = <T>(data: unknown, validatable: Validatable<T>): data is T => check(data, validatable).success;

/**
 * `parse` handles parsing an object with `.json()` and simultaneously acts as a type predicate.
 * 
 * Example usage:
 * ``` typescript
 * const data = await parse(request, Foo);
 * if (!data) return error; // indicates that request's data is not of type `Foo`
 * const { bar, baz } = data; // data is typed as `Foo`
 * ```
 * 
 * @param data an object with a `.json()` field that **has not** been used.
 * @param validatable a validatable object from the `types` directory with a corresponding type
 * @returns relevant predicated as type `T` or `undefined` if the check failed
 */
export const parse = async <T>(o: Jsonable, validatable: Validatable<T>) => {
	if (!check(o, Jsonable).success) return undefined;

	return await o.json().then((data) => {
		if (!ensure(data, validatable)) throw new Error(JSON.stringify(check(data, validatable).errors));
		return data;
	}).catch((error) => {
		console.warn(`[Parsing] ${error}`);
		return undefined;
	})
}

export { typia };