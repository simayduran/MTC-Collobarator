public with sharing class SalesAgentHandler {
    @AuraEnabled(cacheable=true)
    public static List<SA_Details__c> salesAgentMethod() {
        List<SA_Details__c> agentsList = [SELECT Id, Name__c, Date_of_Joining__c, Gender__c  FROM SA_Details__c];
        return agentsList;
    }
    @AuraEnabled(cacheable=true)
    public static List<SA_Details__c> getSalesAgents(String searchKey){
       String keyName = '%' + searchKey + '%';
       List<SA_Details__c> saList = [SELECT Id, Name__c, Date_of_Joining__c, Gender__c  FROM SA_Details__c WHERE Name__c LIKE :keyName];
       return saList;
    }
}