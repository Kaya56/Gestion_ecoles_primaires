@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Position de départ
cd src\main\java\com\school\management

REM Dossiers de base
set folders=config entity\enums dto\request dto\response mapper repository service controller exception

REM Fichiers simples dans les sous-dossiers
set files_config=DatabaseConfig.java CorsConfig.java
set files_entity=Student.java Teacher.java Staff.java User.java Class.java Subject.java Grade.java Payment.java Discipline.java Purchase.java Equipment.java Document.java
set files_enums=Section.java Language.java Gender.java PaymentMode.java DisciplineType.java UserRole.java
set files_dto_request=StudentCreateRequest.java StudentUpdateRequest.java TeacherCreateRequest.java PaymentCreateRequest.java GradeCreateRequest.java DisciplineCreateRequest.java
set files_dto_response=StudentResponse.java TeacherResponse.java PaymentResponse.java GradeResponse.java DisciplineResponse.java
set files_mapper=StudentMapper.java TeacherMapper.java PaymentMapper.java GradeMapper.java DisciplineMapper.java
set files_repository=StudentRepository.java TeacherRepository.java StaffRepository.java UserRepository.java ClassRepository.java SubjectRepository.java GradeRepository.java PaymentRepository.java DisciplineRepository.java PurchaseRepository.java EquipmentRepository.java DocumentRepository.java
set files_service=StudentService.java TeacherService.java StaffService.java UserService.java ClassService.java SubjectService.java GradeService.java PaymentService.java DisciplineService.java PurchaseService.java EquipmentService.java DocumentService.java
set files_controller=StudentController.java TeacherController.java StaffController.java UserController.java ClassController.java SubjectController.java GradeController.java PaymentController.java DisciplineController.java PurchaseController.java EquipmentController.java DocumentController.java
set files_exception=GlobalExceptionHandler.java ResourceNotFoundException.java ValidationException.java

REM Création des dossiers
for %%F in (%folders%) do (
    mkdir %%F
)

REM Création des fichiers
for %%F in (%files_config%) do (
    type nul > config\%%F
)
for %%F in (%files_entity%) do (
    type nul > entity\%%F
)
for %%F in (%files_enums%) do (
    mkdir entity\enums 2>nul
    type nul > entity\enums\%%F
)
for %%F in (%files_dto_request%) do (
    mkdir dto\request 2>nul
    type nul > dto\request\%%F
)
for %%F in (%files_dto_response%) do (
    mkdir dto\response 2>nul
    type nul > dto\response\%%F
)
for %%F in (%files_mapper%) do (
    type nul > mapper\%%F
)
for %%F in (%files_repository%) do (
    type nul > repository\%%F
)
for %%F in (%files_service%) do (
    type nul > service\%%F
)
for %%F in (%files_controller%) do (
    type nul > controller\%%F
)
for %%F in (%files_exception%) do (
    type nul > exception\%%F
)

REM Fichier principal (si manquant)
IF NOT EXIST SchoolManagementApplication.java (
    type nul > SchoolManagementApplication.java
)

REM Retour racine
cd ..\..\..\..

REM Créer resources/application.yml et data.sql
cd resources
type nul > application.yml
type nul > data.sql

REM Créer dossier test/service et test/controller
cd ..\..\..\test\java\com\school\management
mkdir service
mkdir controller

echo ✅ Structure créée avec succès.
pause
