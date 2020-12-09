public class genericCSVGeneratorCtrl{
    @Auraenabled
    public static map<String,List<String>> getallObjects() 
    {
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        map<String,List<String>> Mp=new map<String,List<String>>();
        List<String> objNames = new List<String>();
        List<String> entities = new List<String>(schemaMap.keySet());
        entities.add('--None--');
        entities.sort();
        for(String name : entities)
        {
            objNames.add(name);
        }
        Mp.put('ObjectName',objNames);
        return Mp;
    }
    @Auraenabled
    public static List<sObject> getResultData(String selectedObj){
        try{
            String query ='';
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Map<String, Schema.SObjectField> fieldMap = schemaMap.get(selectedObj).getDescribe().fields.getMap();
            String strFields = '';
            for(String fieldName : fieldMap.keyset() )
            {
                if(strFields == null || strFields == '')
                {
                    strFields = fieldName;
                }else{
                    strFields = strFields + ' , ' + fieldName;
                }
            }
            query = 'select ' + strFields + ' from ' + selectedObj;
            
            List<sObject> resList = Database.query(query);
            return resList;
        }catch( exception e){
            UtilityCtrl.logException('GenericCSVGeneratorObjectsRecords.getResultData',userInfo.getName(),e.getTypeName(), e.getMessage(), e.getStackTraceString());
            throw new AuraHandledException('Error: '+ e.getMessage());
        }
    }
}