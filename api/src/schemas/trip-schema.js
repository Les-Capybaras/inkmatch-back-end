
const tripSchema = {
  startDate: {
    notEmpty: true,
    errorMessage: "Start date is required and must be a string",
    isString: true,
  },
  seats: {
    notEmpty: true,
    errorMessage: "Number of seats is required",
    isInt: true,
  },
  price: {
    notEmpty: true,
    errorMessage: "Price is required",
    isFloat: true,
  },
  estimatedDuration: {
    notEmpty: true,
    errorMessage: "Estimated duration is required",
  },
  steps: {
    notEmpty: true,
    errorMessage: "Steps are required",
    isArray: true,
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          throw new Error("Steps must be an array");
        }
        for (const step of value) {
          if (typeof step !== "object") {
            throw new Error("Step must be an object");
          }
          if (!step.hasOwnProperty("address")) {
            throw new Error("Address is required for each step");
          }
          if (!step.hasOwnProperty("name")) {
            throw new Error("Name is required for each step");
          }
          if (!step.hasOwnProperty("order")) {
            throw new Error("Order is required for each step");
          }
          if (typeof step.address !== "string") {
            throw new Error("Address must be a string");
          }
          if (typeof step.name !== "string") {
            throw new Error("Name must be a string");
          }
          if (typeof step.order !== "number") {
            throw new Error("Order must be a number");
          }
        }
        return true;
      },
    },
  },
};

const searchSchema = {
  startLocation: {
    notEmpty: true,
    errorMessage: "Start location is required",
    isString: true,
  },
  endLocation: {
    notEmpty: true,
    errorMessage: "End location is required",
    isString: true,
  },
  startDate: {
    notEmpty: true,
    errorMessage: "Start date is required and must be a string",
    isString: true,
  },
};


module.exports = {
  tripSchema,
  searchSchema
};
