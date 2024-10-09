// This is the model of schema structure that will be presrcipted into an collection called sb-defined-amenities
// This collection will be controlled by admin(i.e, admin can add or remove or disable an amenities) which will be viewed by user and agent which is explained nextline
//For agent: while adding the amenities on the amenities tab section the frontend developers will call the api getPredefinedAmenities where the predefined amenities response(from below example) is shown
//this below response data will be used by frontend developers to display the ui which has component,type,fieldname,field to store the value etc..
//Now if agent wants to add his own custom fields; no problem, there will be a popup form will be displayed
//in that pop-up form there will be radio-button(predefined amenities or brand-new) if he selects first option from the radio then a dropwon will be displayed
//from that dropdown he will select the title(eg: health-and-fitness) and he has to fill the options form on the pop-up and this option will be added to the predefined amenities in the UI,
//if he selects second radio(brand-new) then he has to give the title and below the last amenities new amenities will be displayed
//Now there is a question before saving this i.e, while the page refreshes should the added customfield disappear or should save in the cache and be always there
//once he fills the predefined amenities field and custom amenities field value he has to save the amenities in his properties schema.
//in the properties-schema -> amenities field he will save all the amenities(predefined and custom fields) as a array of object but not all the fields from below will be his schema field will be saved
//the structure or the fields/element in the array or the data in amenities field in properties schema is given in the file mentioned below
//properties-schema-amenities-field.js (field structure).
[
  {
    title: 'Health and Fitness',
    code: 'sb-health-and-fitness',
    display: true,
    options: [
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
      {
        _id: '',
        code: 'first ',
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
    options: [
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
    ],
  },
  {
    title: 'Miscellaneous',
    display: true,
    code: 'sb-miscellaneous',
    options: [
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
];
