const expect = require('chai').expect;


function validateMissingQueryElement(response, element) {
  expect(response.body.errors).to.deep.equal([
    {
      "field": [
        element
      ],
      "location": "query",
      "messages": [
        `"${element}" is required`
      ],
      "types": [
        "any.required"
      ]
    }
  ]);
}

function validateMissingBodyElement(response, element) {
  expect(response.body.errors[0].field).to.include(element);
  expect(response.body.errors[0].messages).to.include(`"${element}" is required`);
  // expect(response.body.errors).to.deep.equal([
  //   {
  //     "field": element,
  //     "location": "body",
  //     "messages": [
  //       `"${element.pop()}" is required`
  //     ],
  //     "types": [
  //       "any.required"
  //     ]
  //   }
  // ]);
}

module.exports = {
    validateMissingQueryElement,
    validateMissingBodyElement
};
