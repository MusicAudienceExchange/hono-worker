# Instructions for using TYPIA validation

`header.ts` and `index.ts` are compulsory for proper usage. These files have no reason to be modified. 

To use a type, create the type as a `type` or `interface` in `types.ts` and create a respective `Validatable` object. 

Then, choose between `ensure` or `parse` and *boom*, the work is done! `check` is available, but doesn't have any type predication. It should only be used if more flexibility is needed.