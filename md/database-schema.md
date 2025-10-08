user --- id , email , passowrd , dob , name , status?-student or working-proffesional , income

projects--- id(this will be user.id+project.id it will make it unique) , name , description , sides?(thsi will store all the potential things in the project that would require money ) , status(complete, incomplete)

tasks --- id(task.id + user.id) , task(thsui would cokemafter the project the task wopuld the tsep down breakdown of the projects the suer is going to build so user will divide the projects in multiple steps and each steps would named  tasks so the data would stored be like task-1 for step1 and all ) , deadline(thsi will store the dealine for the task like under which tiem the partivular task need to be finished  ) , expenese(this will store the finance cost of included in the task ) , status(completed , incomplete ) 

expense --- id(it will be uniqe for the each prjects ubnder the partiovular user) , amount(this will store the toal amount ) , category(i which category the excpense is going on or required ) 
Income --- id(unique for every user) 

tags --- it will be stored with every project and for tge task the tags would be #crucial-part #ui-part #backend-part #routing-part #miscllenous 

