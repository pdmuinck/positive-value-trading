echo get betway events...

eventPayloads=$(curl 'https://sports.betway.be/api/Events/V2/GetGroup' \
-H 'Content-Type: application/json; charset=UTF-8' \
--data-raw '{"PremiumOnly":false,"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"CategoryCName":"soccer","SubCategoryCName":"belgium","GroupCName":"first-division-a"}' \
--compressed | jq '.Categories | .[0].Events | .[]')





