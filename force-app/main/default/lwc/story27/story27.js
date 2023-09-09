import { LightningElement, api} from 'lwc';

export default class Story27 extends LightningElement {
   @api salist;

    handleOpenRecordClick() {
        const myEvent = new CustomEvent('saview', { detail: this.salist.Id });
        
        this.dispatchEvent(myEvent);
    }  
}