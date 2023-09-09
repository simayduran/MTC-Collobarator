import { LightningElement, wire,api} from 'lwc'; 
import{ publish,MessageContext} from "lightning/messageService";
import SA_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/SAListUpdate__c";
import { NavigationMixin} from "lightning/navigation";
import searchSas from "@salesforce/apex/Story28.searchSas";

        
export default class Story28 extends NavigationMixin (LightningElement){
  searchTerm = '';
  salist;
  
    @wire(MessageContext) messageContext;
    @wire(searchSas, {searchTerm: '$searchTerm' }) 
    loadSADetails(result){
        this.salist = result;
        if(result.data){
            const message = {
                salist : result.data
            };
            publish(this.messageContext, SA_LIST_UPDATE_MESSAGE, message);
        }
    } 

    handleSearchTermChange(event) {
        window.clearTimeout(this.delayTimeout); //kullanıcının gireceği metni bitirdikten sonra çalışsın, sistem yorulmasınw
        const searchTerm =event.target.value;
        this.delayTimeout  = setTimeout(() =>{

        },300);

    handleSAView(event)
    
        const saId = event.detail;

        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",  /* object olduğu için recordPage diyoruz */
          attributes: {
            recordId: saId,
            objectApiName: "SA_Details__c",
            actionName: "view",
          },
        });
    }
}