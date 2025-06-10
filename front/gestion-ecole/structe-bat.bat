@echo off
cd src

:: === Dossiers principaux ===
mkdir components\common
mkdir components\forms
mkdir components\layout
mkdir components\charts
mkdir pages\auth
mkdir pages\students
mkdir pages\teachers
mkdir pages\payments
mkdir pages\grades
mkdir pages\discipline
mkdir pages\classes
mkdir pages\subjects
mkdir pages\staff
mkdir pages\purchases
mkdir pages\equipment
mkdir pages\users
mkdir services
mkdir types
mkdir hooks
mkdir context
mkdir utils

:: === Fichiers components/common ===
for %%f in (Button Input Select Modal Table Card Badge Loading Pagination SearchBar) do (
    echo // %%f component > components\common\%%f.tsx
)

:: === Fichiers components/forms ===
for %%f in (StudentForm TeacherForm PaymentForm GradeForm DisciplineForm StaffForm SubjectForm ClassForm PurchaseForm) do (
    echo // %%f component > components\forms\%%f.tsx
)

:: === Fichiers components/layout ===
for %%f in (Header Sidebar Layout Navigation) do (
    echo // %%f component > components\layout\%%f.tsx
)

:: === Fichiers components/charts ===
for %%f in (StatCard LineChart BarChart PieChart) do (
    echo // %%f component > components\charts\%%f.tsx
)

:: === Fichiers pages ===
echo // Dashboard page > pages\Dashboard.tsx
echo // Login page > pages\auth\Login.tsx

:: === Pages sous-dossiers ===
:: students
for %%f in (StudentList StudentDetail StudentCreate) do (
    echo // %%f page > pages\students\%%f.tsx
)
:: teachers
for %%f in (TeacherList TeacherDetail TeacherCreate) do (
    echo // %%f page > pages\teachers\%%f.tsx
)
:: payments
for %%f in (PaymentList PaymentCreate) do (
    echo // %%f page > pages\payments\%%f.tsx
)
:: grades
for %%f in (GradeList GradeEntry ReportCard) do (
    echo // %%f page > pages\grades\%%f.tsx
)
:: discipline
for %%f in (DisciplineList DisciplineCreate) do (
    echo // %%f page > pages\discipline\%%f.tsx
)
:: classes
for %%f in (ClassList ClassManagement) do (
    echo // %%f page > pages\classes\%%f.tsx
)
:: subjects
for %%f in (SubjectList SubjectManagement) do (
    echo // %%f page > pages\subjects\%%f.tsx
)
:: staff
for %%f in (StaffList StaffCreate) do (
    echo // %%f page > pages\staff\%%f.tsx
)
:: purchases
for %%f in (PurchaseList PurchaseCreate) do (
    echo // %%f page > pages\purchases\%%f.tsx
)
:: equipment
for %%f in (EquipmentList EquipmentCreate) do (
    echo // %%f page > pages\equipment\%%f.tsx
)
:: users
for %%f in (UserList UserManagement) do (
    echo // %%f page > pages\users\%%f.tsx
)

:: === Fichiers services ===
for %%f in (api auth student teacher payment grade discipline class subject staff purchase equipment user) do (
    echo // %%f service > services\%%f.service.ts
)

:: === Fichiers types ===
for %%f in (api student teacher payment grade discipline class subject staff purchase equipment user) do (
    echo // %%f types > types\%%f.types.ts
)

:: === Fichiers hooks ===
for %%f in (useAuth useApi usePagination useLocalStorage) do (
    echo // %%f hook > hooks\%%f.ts
)

:: === Fichiers context ===
for %%f in (AuthContext ThemeContext) do (
    echo // %%f context > context\%%f.tsx
)

:: === Fichiers utils ===
for %%f in (constants helpers formatters validators pdf.utils) do (
    echo // %%f utility > utils\%%f.ts
)

:: === Fichiers racine ===
echo // Main application file > App.tsx
echo // Vite entry point > main.tsx
echo /* Global styles */ > index.css

echo Projet structuré avec succès !
pause
