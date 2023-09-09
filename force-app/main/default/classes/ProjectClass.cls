public with sharing class ProjectClass {
    @AuraEnabled(cacheable=true)
    public static List<SA_Details__c> getSA() {
       return [SELECT Id, Name__c, Customer_Handled__c, Experience__c, Date_of_Joining__c, Gender__c FROM SA_Details__c];
      
    }

    @AuraEnabled(cacheable=true)
    public static SA_Details__c[] searchSaas(String searchTerm){
        searchTerm = searchTerm.trim();
        if(searchTerm == ''){
            return getSA();
        }
        searchTerm = '%' + searchTerm + '%';
        return [
            SELECT
            Id,
            Name__c,
            Gender__c,
            Experience__c,
            Customer_Handled__c,
            Date_of_Joining__c,
            Location__Longitude__s,
            Location__Latitude__s
            FROM SA_Details__c WHERE Name__c LIKE :searchTerm WITH SECURITY_ENFORCED 
            ORDER BY Name__c LIMIT 50
        ];
    }
}


