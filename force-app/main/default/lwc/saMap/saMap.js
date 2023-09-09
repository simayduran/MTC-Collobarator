import { LightningElement, wire } from 'lwc';
import {  MessageContext, subscribe, unsubscribe} from 'lightning/messageService';
import SA_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/SAListUpdate__c";

export default class SaMap extends LightningElement {
    mapMarkers=[];
    subscription = null;
    @wire(MessageContext)
    messageContext;
    /* lifecycle hook
    connectedCallback()
    disconnectedCallback()
    constructor()
    render()
    renderCallback()
    errorCallback()*/
    connectedCallback(){
        this.subscription= subscribe(
            this.messageContext,SA_MESSAGE, (message)=>{this.handleSAMap(message);});
        }
    disconnectedCallback() {unsubscribe(this.subscription);
    this.subscription=null;
        }

    handleSAMap(message){
        this.mapMarkers = message.sadetails.map((adetail)=>{
            const Latitude = adetail.Location__Latitude__s;
            const Longitude = adetail.Location__Longitude__s;
            return{
                location: {Latitude,Longitude},
                title: adetail.Name__c,
                description:  `Coords: ${Latitude}, ${Longitude}`,
                icon: "standard:visits"
            };
        });

    }
}