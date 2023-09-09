import { LightningElement, wire, api } from 'lwc';
import getSA from '@salesforce/apex/ProjectClass.getSA';
import searchSaas from '@salesforce/apex/ProjectClass.searchSaas';
import { publish, MessageContext } from 'lightning/messageService';
import SA_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/SAListUpdate__c";
import { NavigationMixin } from 'lightning/navigation';

export default class ProjectParent extends NavigationMixin(LightningElement) {
    searchTerm = "";

    sadetails;
    @wire(MessageContext) messageContext;
    @wire(searchSaas, {searchTerm: "$searchTerm"})
    loadSAdetails(result){
        this.sadetails = result;
            if(result.data){
                const message = {
                    sadetails: result.data
                };
                publish(this.messageContext, SA_LIST_UPDATE_MESSAGE, message);
            }
    }

    handleSearchTermChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchTerm;
        }, 300);
    }

    get hasResults(){
        return this.sadetails.data.length > 0;
    }

    handleSAView(event){
       const saId = event.detail;
        window.open('/lightning/r/SA_Detail__c/' + saId + '/view', '_blank');
       /* this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: saId,
                objectApiName: "SA_Detail__c",
                actionName: "view"
            },
        }, true);*/
    }
}