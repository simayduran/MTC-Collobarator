public without sharing class FdDetailsService {

    @AuraEnabled (Cacheable=true)
    public static FD_Details__c fetchCusType(String fdId){

        return [SELECT Id, Name, Customer_Type__c 
        FROM FD_Details__c
        WHERE Id = : fdId];
    }

    @AuraEnabled (Cacheable=true)
    public static List<Interest_Scheme__c> fetchInterestScheme (String fdId, String cusType, String depType,
    Integer tnrMonth, Integer tnrDay, Integer fdAmount) {

        List<Interest_Scheme__c> listInt = [SELECT Id, Name,Interest_Rate__c
                                             FROM Interest_Scheme__c
                                             WHERE Customer_Type__c = : cusType
                                             AND Deposit_Type__c = : depType
                                             AND Tenor_From_Months__c <= : tnrMonth
                                             AND Tenor_To_Months__c >=: tnrMonth
                                             AND Tenor_From_Days__c <=: tnrDay
                                             AND Tenor_To_Days__c >=:tnrDay
                                             AND From_Amount__c <= : fdAmount
                                             AND To_Amount__c >= : fdAmount
                                             AND Active__c = true];
        return listInt;
    }

    @AuraEnabled 
    public static void updateFD (String fdId, String depType,
    Integer tnrMonth, Integer tnrDay, Integer fdAmount, String schmId, Decimal intRate, String payFreq){

        FD_Details__c recFd = new FD_Details__c();
        recFd.Id = fdId;
        recFd.Deposit_Type__c = depType;
        recFd.Tenor_in_months__c = tnrMonth;
        recFd.Tenor_in_days__c = tnrDay;
        recFd.FD_Amount__c = fdAmount;
        recFd.Interest_Scheme__c = schmId;
        recFd.Interest_Rate__c = intRate;
        recFd.Payout_Frequency__c = payFreq;

        update recFd;
    }
   
}