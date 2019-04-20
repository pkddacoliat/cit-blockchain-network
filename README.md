# FYP - Business Network Application (BNA)

This repository contains the business definitions (i.e. model files, permissions, chaincode, and query) for the private blockchain network for my final year project.

## TODO
- [x] Admin can add a student 
- [x] Admin can add a verifier
- [x] Admin can add a course
- [x] Admin can add a module
- [x] Admin can enroll a student
- [x] Admin can assign a grade to a student

## Business Model
The models defined in the BNA are the following:
- Participants
`Issuer` `Student` `Verifier`
- Assets
`Course` `Module` `Grade`
- Transaction
`EnrollStudent` `AssignGrade`

## 1. Clone the repo
Clone the repo locally. Using a terminal, run the commands below:
```sh
git clone https://github.com/pkddacoliat/fyp-bna.git
cd fyp-bna
```

## 2. Generate the business archive file
The business archive file will contain all the business definition stated in the [business model](#business-model) section. From the root of the directory, run the following commands using a terminal:
```sh
npm install
mkdir dist
npm run prepublish
```
A BNA file should be generated inside the `dist` folder. You can import the file into [Hyperledger Composer - Playground](https://composer-playground.mybluemix.net/) to play around with the network.

### Testing the BNA using Playground
Connect to the business network and head over to the **Test** tab:  

Create a `Student` participant:
```json
{
  "$class": "ie.cit.blockchain.participant.Student",
  "participantNo": "STUDENT001",
  "contact": {
    "$class": "ie.cit.blockchain.participant.Contact",
    "firstName": "John",
    "lastName": "Doe",
    "email": "John.Doe@mycit.ie"
  }
}
```

Create a `Course` asset:
```json
{
  "$class": "ie.cit.blockchain.course.Course",
  "courseCode": "CR106",
  "courseTitle": "Software Development",
  "fieldOfStudy": ["Software Development"],
  "department": "Computer Science",
  "courseType": "HONOURS_DEGREE",
  "qualificationType": "BSC_HONOURS",
  "deliveryMode": "FULL_TIME",
  "noOfSemesters": 8,
  "totalCredits": 240,
  "NFQLevel": 8
}
```
Create a `Module` asset:
```json
{
  "$class": "ie.cit.blockchain.module.Module",
  "crn": "15664",
  "moduleCode": "INTR8016",
  "title": "Proj - Research Phase DCOM4",
  "credits": 5,
  "Level": "ADVANCED",
  "stage": 4,
  "semester": 7
}
```

Submit a `EnrollStudent` transaction:
```json
{
  "$class": "ie.cit.blockchain.course.EnrollStudent",
  "courseCode": "CR106",
  "studentNumber": "STUDENT001"
}
```

Submit a `AssignGrade` transaction:
```json
{
  "$class": "ie.cit.blockchain.grade.AssignGrade",
  "moduleCRN": "15664",
  "studentNumber": "STUDENT001",
  "finalGrade": 85
}
```

## 3. Deploy BNA to local Fabric:
To deploy the business network archive to the Hyperledger Fabric, use the following commands:

Install the business network:
```sh
composer network install -a cit_blockchain.bna -c PeerAdmin@hlfv1
```

Start the business network:
```sh
composer network start -c PeerAdmin@hlfv1 -n cit_blockchain -V 0.0.1 -A admin -S adminpw
```

A network administrator card should be generated in the `dist` folder. Import the card to the network:
```sh
composer card import -f admin@cit_blockchain.card 
```

Check that the business network has been deployed successfully by using the ping command:
```sh
composer network ping -c admin@cit_blockchain
```

## 4. Generate REST server
To generate the REST server that invokes the assets and transactions in the business network, use the `composer-rest-server` command:
```sh
composer-rest-server -c admin@cit_blockchain -n always -w true
```