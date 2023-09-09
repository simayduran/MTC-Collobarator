import { LightningElement, api, wire } from 'lwc';
import fetchCusTypeLocal from '@salesforce/apex/FdDetailsService.fetchCusType';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import FdDetailLocal from "@salesforce/schema/FD_Details__c";
import depTypeLocal from "@salesforce/schema/FD_Details__c.Deposit_Type__c";
import payFreqLocal from "@salesforce/schema/FD_Details__c.Payout_Frequency__c";
import fetchInterestScheme from '@salesforce/apex/FdDetailsService.fetchInterestScheme';
import updateFD from '@salesforce/apex/FdDetailsService.updateFD';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SelectScheme extends LightningElement {

    @api recordId
    customerOptions = []
    selectedCusType = ''
    depTypeOptions = []
    selectedDepType = ''
    payFreqData
    payFreqOptions = []
    selectedFreqType = ''
    selectedMonth = ''
    selectedDay = ''
    fdAmount = 0
    listScheme = []
    selectedIntRate
    selectedIntSchmId
    


//Customer Type Combobox
    @wire(fetchCusTypeLocal, {fdId :'$recordId'
}) wireData({data, error}){
    if(data){
        let options = []
        options.push({label:data.Customer_Type__c, value: data.Customer_Type__c})
        this.customerOptions = options;
    } else if(error){
        console.log('Customer Type bilgisi sorgulanırken hata alındı')
    }
}

cusTypeChange(event) {

    this.selectedCusType = event.detail.value;

}

//Deposit Type Combobox

@wire(getObjectInfo, {objectApiName:FdDetailLocal})
fdObjectInfo;

@wire(getPicklistValues, {recordTypeId:'$fdObjectInfo.data.defaultRecordTypeId', fieldApiName:depTypeLocal})
wiredDataDep({data, error}){
    if(data){
        let options = []
        data.values.forEach(element => {
            options.push({label: element.label, value:element.value});
                      
        });
        this.depTypeOptions = options;
    } else if(error) {
        console.log('Deposite Type bilgisi sorgulanırken hata alındı');
    }
}

depTypeChange(event){
    this.selectedDepType = event.detail.value;
    console.log('Selected Deptype: ' + this.selectedDepType);

    //Field Dependency
    let key = this.payFreqData.controllerValues[event.detail.value]
    this.payFreqOptions = this.payFreqData.values.filter(opt=>opt.validFor.includes(key))

}

//Payout Frequency
@wire(getPicklistValues, {recordTypeId:'$fdObjectInfo.data.defaultRecordTypeId', fieldApiName:payFreqLocal})
wiredDataPay({data, error}){
    if(data){
        
        this.payFreqData = data;
   
    } else if(error) {
        console.log('Payout Frequency bilgisi sorgulanırken hata alındı');
    }
}

payoutFreqChange(event){
    this.selectedFreqType = event.detail.value;
    console.log('Selected Deptype: ' + this.selectedFreqType);

}
 //Tenor in Months
get tenorMonthOptions(){
    let options = []
    for(var i=0; i<72; i++){
        options.push({ label: i.toString(), value:i.toString()})
    }
    return options
}

tenorMonthChange (event){
    this.selectedMonth = event.detail.value


}
//Tenot in Days
get tenorDayOptions(){
    let options = []
    for(var i=0; i<30; i++){
        options.push({ label: i.toString(), value:i.toString()})
    }
    return options
}

tenorDayChange (event){
    this.selectedDay = event.detail.value

}
//FD Amount

fdAmountChange(event){
    this.fdAmount = event.detail.value
}

// Fetch Scheme Button

fetchSchemeClick (event) {
    let isValid = true
    let inputFields = this.template.querySelectorAll('.clsFrmFetchSchm');
    inputFields.forEach(inputFields => {
        if(!inputFields.checkValidity()){
            inputFields.reportValidity()
            isValid = false
        }

    })
    if(isValid){
        //call Apex Method to Fetch Interest Scheme Data

        fetchInterestScheme({
            fdId: this.recordId, 
            cusType: this.selectedCusType, 
            depType: this.selectedDepType,
            tnrMonth: this.selectedMonth, 
            tnrDay: this.selectedDay,
            fdAmount:this.fdAmount


        }).then(result => {
            var lstSchm = []
            for(var i=0; i<result.length; i++){
                var tempObj = {}
                tempObj.label = result[i].Name
                tempObj.value = result[i].Id
                tempObj.interestRate = result[i].Interest_Rate__c
                lstSchm.push(tempObj)

            }
            this.listScheme = lstSchm
        }).catch(error => {

            console.log('Interest Scheme sorgulanırken hataoluştu: hata mesajı : ' +error.message)
        })

        
    }
}

//Interest Rate Field
schmChange(event){ // InterestScheme dan gelecn Recod un Interest Rate ve ID bilgilerini 
    //property'e atıyorum schmChange Methodu ile HTML'de görünür yapıyorum
    var schemeRecId = event.detail.value
    for (var i=0; i< this.listScheme.length; i++){
        if(schemeRecId  == this.listScheme[i].value){
            this.selectedIntRate =this.listScheme[i].interestRate
            this.selectedIntSchmId = schemeRecId
            console.log('Selected Int rate: ' + this.selectedIntRate)
        }
    }
}

saveClick(){
    let isValid = true
    let inputFields = this.template.querySelectorAll('.clsFrmFetchSchm');
    inputFields.forEach(inputFields => {
        if(!inputFields.checkValidity()){
            inputFields.reportValidity()
            isValid = false
        }

    })

    inputFields = this.template.querySelectorAll('.classForSaveButton');
    inputFields.forEach(inputFields => {
        if(!inputFields.checkValidity()){
            inputFields.reportValidity()
            isValid = false
        }

    });
    



    if(isValid){
        //call Apex Method to Save/Update Data

        updateFD({
            fdId: this.recordId, 
            depType: this.selectedDepType,
            tnrMonth: this.selectedMonth, 
            tnrDay: this.selectedDay,
            fdAmount:this.fdAmount,
            schmId:this.selectedIntSchmId,
            intRate:this.selectedIntRate,
            payFreq:this.selectedFreqType


        }).then(result => {

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