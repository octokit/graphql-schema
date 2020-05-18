// import { validate, schema } from "..";
import GrapqlSchema, { validate, schema } from ".."

export default async function () {
	const query = `
	{
	  viewer {
		login
	  }
	}
	`;

	/* Testing default import */
	GrapqlSchema.validate(query);

	// Obtains schemas properly
	GrapqlSchema.schema.json
	GrapqlSchema.schema.idl

	/* Testing named imports */
	validate(query);

	// Obtains schemas properly
	schema.json
	schema.idl
}

