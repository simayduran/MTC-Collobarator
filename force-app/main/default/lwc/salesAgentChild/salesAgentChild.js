import { LightningElement, wire } from 'lwc';
import elma from '@salesforce/apex/SalesAgentHandler.SalesAgentMethod';

export default class SalesAgentChild extends LightningElement {
    @wire(elma,)salesAgent;
    filterWord ="";

    @wire(elma, {searchKey: '$filterWord'}) SARecords;
    recordId;

    handleClick(){
        const myEvent = new CustomEvent ('clicked', {detail : this.recordId});

        this.dispatchEvent(myEvent);
    }
}

