import { LightningElement,wire, api } from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import JUNCTION_OBJECT from "@salesforce/schema/FD_Applicant_Junction__c";
import TYPE_FIELD from "@salesforce/schema/FD_Applicant_Junction__c.Type__c";
import saveRecords from "@salesforce/apex/ApplicantDetailService.saveRecords";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class AddApplicant extends LightningElement {

    @api recordId
    applTypeOptions
    selectedApplType
    showAddApplicant = false
    objApplicant = {}
    listApplicants = []

    //Applicant Type Combobox

@wire(getObjectInfo, {objectApiName:JUNCTION_OBJECT})
fdObjectInfo;

@wire(getPicklistValues, {recordTypeId:'$fdObjectInfo.data.defaultRecordTypeId', fieldApiName:TYPE_FIELD})
wiredTypeField({data, error}){
    if(data){
        let options = []
        data.values.forEach(element => {
            options.push({label: element.label, value:element.value});
                      
        });
        this.applTypeOptions = options;
    } else if(error) {
        console.log('Deposite Type bilgisi sorgulanırken hata alındı');
    }
}

applTypeChange(event){
    this.selectedApplType = event.detail.value
}
//Add Applicant Buton
addApplicantClick(){
    //Validate Inputs
    let isValid = true
    let inputFields = this.template.querySelectorAll('.validateCombobox');
    inputFields.forEach(inputFields => {
        if(!inputFields.checkValidity()){
            inputFields.reportValidity()
            isValid = false
        }

    })
    //Applicant Type field seçilmiş ise Applicant ekleme formu gösterilsin
    if(isValid) {
        this.showAddApplicant = true

    }
    

}
// First Name Input
fNameChange(event){
    this.objApplicant.First_Name__c = event.target.value
}

// Last Name Input
lNameChange(event){
    this.objApplicant.Last_Name__c = event.target.value
}

// SSN Input
ssnChange(event){
    this.objApplicant.SSN__c = event.target.value
}
// DateOfBirth Input
dobChange(event){
    this.objApplicant.DateOfBirth__c = event.target.value
}
// Mobile Input
mobileChange(event){
    this.objApplicant.Mobile__c = event.target.value
}
// Email Input
emailChange(event){
    this.objApplicant.Email__c = event.target.value
}
// Adress Input
addressChange(event){
    this.objApplicant.Address__c = event.target.value
}
//Close Fonksiyonu
handleClose(event){
    this.showAddApplicant = false;
}

handleSave(event){
      //Validate Inputs
      let isValid = true
      let inputFields = this.template.querySelectorAll('lightning-input');
      inputFields.forEach(inputFields => {
          if(!inputFields.checkValidity()){
              inputFields.reportValidity()
              isValid = false
          }
  
      })

      let addressFields = this.template.querySelector('lightning-textarea');
      
          if(!addressFields.checkValidity()){
              addressFields.reportValidity()
              isValid = false
          }

          //Kaydetme işlemi
if(isValid){
    //call Apex Method to Save/Update Data

    saveRecords({
        

        objAppl : this.objApplicant,
        fdId : this.recordId,
        applType : this.selectedApplType


    }).then(result => {
        if(result.isSuccess){
            console.log('Apex methodundan dönen wrapper object: ' + result.appInterList)
            this.listApplicants = result.appInterList;
        }

        const event = new ShowToastEvent({
            title: 'Success',
            message:'Kaydetme işlemi başarılı',
            variant: 'Success'
        });
        this.dispatchEvent(event);

    }).catch(error => {

        const event = new ShowToastEvent({
            title: 'Get Help',
            message:'Kaydetme işlemi esnasında Hata oluştu: hata mesajı: ' + error.body.message,
            variant: 'Error'
                
        });
        this.dispatchEvent(event);
    })

    
}
}


}