// user request or amenities field/document in properties-schema suggestion1
[
  {
    id: '1',
    value: true,
  },
  {
    id: '2',
    value: 2025, // number || string
  },

  {
    id: '3',
    value: ['Monthly', 'Quarterly'],
  },
];

//user request or amenities field/document in properties-schema suggestion2
//if you compare the predefined amenities which is in predefined-amenities-schema-model.js file
//from the sb-health-and-fitness only 2 are added below but in predefined there are 3 options
//that is because he only selected 2 options which are here. If he didn't select any option that is not saved
//the above line has an issue how the frontend developer can know if he has updated the vslur field in options(what if for example he selected the modified value true and then again changed to false which is default). that is
//How will the frontend developer filter the amenities array that is to be sent to api with modified and not-modified field.
//anyway-if above 3 line issue is solved then our amenities to ad from frontend will be like below given example
//that is custom field will be added either on the predefined like elevators option in building or
//like the whole title object sb-events-and-parties will be added in the end
//the custom field sb-events-and-parties will be added only on the respective agents proeprties schema not on predefined seeded amenities as it is only for the frontend developer to refer for the UI
//compare this with predefined-amenities-schema-model.js file array if you want to know the difference in the schema structure that will be saved in predefined-amenities-schema and properties-schema -> amenities document/field
[
  {
    title: 'Health and Fitness',
    code: 'sb-health-and-fitness',
    display: true,
    Option: [
      {
        _id: '',
        code: 'first',
        name: 'First Aid Medical Center',
        component: 'checkbox',
        type: null,
        options: [],
        value: true,
        multipleSelection: false,
        display: true,
        required: true,
      },
      {
        _id: '',
        code: 'sb-first-aid-medical-center ',
        name: 'First Aid Medical Center',
        component: 'checkbox',
        type: null,
        options: [],
        value: true,
        multipleSelection: false,
        display: true,
        required: true,
      },
    ],
  },
  {
    title: 'Building',
    display: true,
    code: 'sb-building',
    Option: [
      {
        _id: '',
        code: '',
        name: 'Completion Year',
        component: 'input',
        type: 'number',
        options: [],
        value: 2025,
        multipleSelection: false,
        display: true,
        required: true,
      },
      {
        _id: '',
        code: '',
        name: 'Total Elevators',
        component: 'input',
        type: 'number',
        options: [],
        value: 0,
        multipleSelection: false,
        display: true,
        required: true,
      },
    ],
  },
  {
    title: 'Miscellaneous',
    display: true,
    code: 'sb-miscellaneous',
    Option: [
      {
        _id: '',
        code: '',
        name: 'Rent Is Paid',
        component: 'dropdown',
        type: null,
        options: ['Quarterly', 'Monthly', 'Yearly'],
        multipleSelection: false,
        value: null,
        display: true,
        required: true,
      },
    ],
  },
  {
    title: 'Events & Parties',
    display: true,
    code: 'sb-events-and-parties',
    Option: [
      {
        _id: '',
        code: '',
        name: 'buffet',
        component: 'checkbox',
        type: null,
        options: [],
        multipleSelection: false,
        value: true,
        display: true,
        required: true,
      },
    ],
  },
];
