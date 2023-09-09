public with sharing class ApplicantDetailService {
    public class ApplicantWrapper{
        @AuraEnabled
        public List<FD_Applicant_Junction__c> appInterList;
        @AuraEnabled
        public Boolean isSuccess;
        @AuraEnabled
        public String errorMessage;
    }

    @AuraEnabled
    public static ApplicantWrapper saveRecords (Applicant_Details__c objAppl, String fdId, String applType)
    {
        ApplicantWrapper objectWrapper = new ApplicantWrapper();
        
        try {

            List<Applicant_Details__c> appList = [SELECT Id FROM Applicant_Details__c WHERE SSN__c =: objAppl.SSN__c];
        
        if(!appList.isEmpty()){
            objAppl.Id = appList[0].Id;
        }
        upsert objAppl;
        

        List<FD_Applicant_Junction__c> intRecs = [SELECT Id FROM FD_Applicant_Junction__c
                                                    WHERE FD_Details__c =: fdId
                                                    AND Applicant_Details__c =: objAppl.Id
                                                     ];
        
        
        objectWrapper.isSuccess = true;
        objectWrapper.errorMessage = '';
        //ıntRecs dolu ise Applicant zaten FD DEtails ile ilişkilendirlmiş demektir. Yeni bir 
        //Junction Object oluşturmaya gerek yok
        if(!intRecs.isEmpty()){
            objectWrapper.isSuccess = false;
            objectWrapper.errorMessage = 'Bu Applican FD Details iel daha önceden ilişkilendirilmiştir. Yeniden ekleme yapılamaz';
        }
        //Applican önceden ilişkilendirlmemiş ise isSuccess true olacaktır ve yeni bir Junction kaydı oluşturacaktır.
        if(objectWrapper.isSuccess){
            FD_Applicant_Junction__c objFdIntermediate = new FD_Applicant_Junction__c();
            objFdIntermediate.FD_Details__c = fdId;
            objFdIntermediate.Applicant_Details__c = objAppl.Id;
            objFdIntermediate.Type__c = applType;
            insert objFdIntermediate;
            objectWrapper.appInterList = selectAllJunctions (fdId);


        }

            
        } catch (Exception e) {

            objectWrapper.isSuccess = false;
            objectWrapper.errorMessage = 'Kaydetme esnasında beklenmeyen bir hata alındı! (Apex) hata mesajı: '+e.getMessage();
            
        }

        
                                                    
        return objectWrapper;

    }

    private static List<FD_Applicant_Junction__c> selectAllJunctions(String fdId){
        return [SELECT Id, Applicant_Details__r.First_Name__c, Applicant_Details__r.Last_Name__c, Applicant_Details__r.SSN__c, Type__c  FROM FD_Applicant_Junction__c WHERE FD_Details__c=:fdId];
    }

   
}