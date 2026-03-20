<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>User Management - Student Mentoring System</title>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&amp;family=Noto+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2b6cee",
                        "background-light": "#f6f6f8",
                        "background-dark": "#101622",
                    },
                    fontFamily: {
                        "display": ["Lexend", "sans-serif"],
                        "body": ["Noto Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Lexend', sans-serif;
        }
        /* Custom scrollbar for better look in table/sidebar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #334155; 
        }
        .dark ::-webkit-scrollbar-thumb:hover {
            background: #475569; 
        }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden">
<div class="flex h-screen w-full overflow-hidden">
<!-- SideNavBar -->
<aside class="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full">
<div class="p-6 pb-2">
<div class="flex gap-3 items-center mb-8">
<div class="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0" data-alt="University Logo abstract geometric shape" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-rytG8XbjA6znruhJEfI63DupeM8KmlfXj5onFpmTZecBjKVwWiOfdChFOziSc3u-_y6uMChlBNFNeiWd1baEpUy7iEPZhv1je0DADppfytL9s6Y6_ymqNo46i-KIJu7qjFsFW8S1xW1QXAm1YIy_ie9PtyGtOUFA6fO44rGjKXcIst9so1idY8Oi3ZoGjMYtBHBeyWQy7w03Uk65ycZy1c9J3wjf5XZyanXBspZqvW25QO1IPnTzkxSfZS4n9uSfnK6cuw8sMvI");'></div>
<div class="flex flex-col">
<h1 class="text-slate-900 dark:text-white text-base font-bold leading-normal">Admin Console</h1>
<p class="text-slate-500 dark:text-slate-400 text-xs font-normal">University Portal</p>
</div>
</div>
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
<span class="text-sm font-medium">Dashboard</span>
</a>
<!-- Active State -->
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20" href="#">
<span class="material-symbols-outlined fill-1">group</span>
<span class="text-sm font-medium">User Management</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">school</span>
<span class="text-sm font-medium">Mentorships</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">bar_chart</span>
<span class="text-sm font-medium">Reports</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">settings</span>
<span class="text-sm font-medium">Settings</span>
</a>
</nav>
</div>
<div class="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover" data-alt="Profile picture of the logged in administrator" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBljVmvHkIHDn4UNZ5kDkYxtitNVkLL64SGS-gfCIel8xLcZn3-4cvCT9n3LnIurNFwkgOzY0RHzEikH5DptuVUY450Kwa-kaKRTq8YuKejs-nVIuqGjl5kX4Jb6gAwM2heShpIfbHXUuaxSyt-JsWSxPiZpSFPqGfH5Lxnmu4FGL9fq4TH3u98YMqW4mUDd-cgS0PP4SjbkCAjP34X4ag3zYvU9np8ZVGYP3rhgOsnWMGjtut82h0xnM6LWi_SIWDGvvMs3xqQVQ");'></div>
<div>
<p class="text-sm font-medium text-slate-900 dark:text-white">Alex Morgan</p>
<p class="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
</div>
<button class="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span class="material-symbols-outlined">logout</span>
</button>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
<!-- Header Area -->
<div class="flex-shrink-0 px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
<div class="max-w-7xl mx-auto flex flex-col gap-6">
<!-- Title & Description -->
<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
<div class="flex flex-col gap-2">
<h1 class="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">User Management</h1>
<p class="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">Manage faculty mentors and student accounts, assignments, roles, and access permissions.</p>
</div>
<!-- Top Actions -->
<div class="flex items-center gap-3">
<button class="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
<span class="material-symbols-outlined text-[20px]">upload_file</span>
<span>Import CSV</span>
</button>
<button class="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
<span class="material-symbols-outlined text-[20px]">add</span>
<span>Add New User</span>
</button>
</div>
</div>
<!-- Filters & Search Toolbar -->
<div class="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
<!-- Left: Search & Filters -->
<div class="flex flex-1 flex-col md:flex-row gap-3 w-full xl:w-auto">
<!-- Search -->
<div class="relative flex-1 min-w-[280px] max-w-[400px]">
<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-slate-400">search</span>
</div>
<input class="block w-full h-11 pl-10 pr-3 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary sm:text-sm" placeholder="Search by name, email, or ID" type="text"/>
</div>
<!-- Role Filter -->
<div class="relative w-full md:w-48">
<select class="block w-full h-11 pl-3 pr-10 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm appearance-none cursor-pointer">
<option value="">All Roles</option>
<option value="mentor">Mentor</option>
<option value="student">Student</option>
<option value="admin">Administrator</option>
</select>
<div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
<span class="material-symbols-outlined text-slate-500">expand_more</span>
</div>
</div>
<!-- Department Filter -->
<div class="relative w-full md:w-48">
<select class="block w-full h-11 pl-3 pr-10 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm appearance-none cursor-pointer">
<option value="">All Departments</option>
<option value="cs">Computer Science</option>
<option value="eng">Engineering</option>
<option value="arts">Arts &amp; Design</option>
</select>
<div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
<span class="material-symbols-outlined text-slate-500">expand_more</span>
</div>
</div>
</div>
<!-- Right: Bulk Actions (Conditional style placeholder) -->
<div class="flex items-center gap-3">
<span class="text-sm text-slate-500 dark:text-slate-400">
<span class="font-medium text-slate-900 dark:text-white">1,248</span> users found
                             </span>
<button class="p-2 text-slate-400 hover:text-primary transition-colors" title="Filter settings">
<span class="material-symbols-outlined">filter_list</span>
</button>
</div>
</div>
</div>
</div>
<!-- Table Content Area -->
<div class="flex-1 overflow-auto p-4 md:p-8">
<div class="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full max-h-full">
<!-- Table Wrapper -->
<div class="overflow-x-auto flex-1">
<table class="w-full text-left border-collapse">
<thead class="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
<tr>
<th class="p-4 w-12 border-b border-slate-200 dark:border-slate-700" scope="col">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700" scope="col">User</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 hidden sm:table-cell" scope="col">Role</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 hidden md:table-cell" scope="col">Department</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 hidden lg:table-cell" scope="col">Mentorship</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700" scope="col">Status</th>
<th class="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 w-16 text-center" scope="col">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-200 dark:divide-slate-800">
<!-- Row 1 -->
<tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td class="p-4">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</td>
<td class="p-4">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" data-alt="Portrait of Arjun Bala" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBROf-j8JXjL302qfyTSjJdK6XT22nSzkWqWjQNaQ6TDRP1U-mL_Q87PdyqB8AKLCHyxBlMApE56ji9x7wU-dBaS6xBmecFPF9WHl220PQp7rJ_qi6Ss6Dbv9Iv_N01y7zk_c5XOezu0tLARwJelnqg3nMkLqToDM3z8YbXrUF_Biz5qENMRG0A-A4sPp3mPu60ET8ZL_JFG0eVjj5BBQQX6q2yH_UVzaksHBLfC6pI_OLzQXsQ0Ki5UaPJPuUNTQYb7HQG2tq1rKs");'></div>
<div class="flex flex-col">
<span class="text-sm font-semibold text-slate-900 dark:text-white">Arjun Bala</span>
<span class="text-xs text-slate-500 dark:text-slate-400">sarah.c@uni.edu</span>
</div>
</div>
</td>
<td class="p-4 hidden sm:table-cell">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            Mentor
                                        </span>
</td>
<td class="p-4 hidden md:table-cell">
<span class="text-sm text-slate-600 dark:text-slate-300">Computer Science</span>
</td>
<td class="p-4 hidden lg:table-cell">
<div class="flex -space-x-2 overflow-hidden">
<div class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover" data-alt="Mentee student 1" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVS-htS2vlmbQQ4xoukgSBJ2VDaolIr0Dy8J-UYU_sirGjvPx0E-BbCYdgvCL3GTDmp2qfpvn43CErEo4JNkGlCLRZuhO2Vj4t1q0hb88-sZJrBv7cgIhHyg5h3ZRW31ThUntT8qd8oJuMLBCWpdTfqPK17VyKgo9eWNCsktC7Lc1610MzKrccL9Y31gpMYIq8Ro4CsAukqt2Cs4MpQ8MWqDdmyPIL7sbILKXwOp1-WU19plVCKF0DtHDA0PmvTaYZhGOI3BP6Jpc");'></div>
<div class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover" data-alt="Mentee student 2" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoVEsOSW-MVFsihscqkfiH8_zuPgMyTBqc8Jud-MhKuT8QVC7TGari8jNyroDWf7oZln_Abmrb7P6Ziwy28O1jdjXF1NhjS2x7K5LgnKe6Iv_lKZ1B17l-_63SUZPIIMYM2NHHg3Z7AihIMLAkEI1MOtx6J2503EhwwORcba98GXimwtskAB5kpFvlVOFUQ2ILDTATdnvM8axauJB5PFJjpZkbX8j7BL8WR86DtCHeNTwkQXp2yExwc8FaC69Nb88-fVfJTMrmCaw");'></div>
<div class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover" data-alt="Mentee student 3" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnN-WX1yZrmu87qW3ZHRm64REQJLePq4n12soHTmbP7i7EbKLsG93qQTk02W_c7TjYVLq5tUq2kDfJgFcwfILGPsonGhoddbPzFlqGBscagfCxtOrEQjP2Skl13lYycqBRprcRO9lC8TnNX6Chbk72k0MeZRe2Ki2hPd8YSRgwe9tIuhFgDuhDqWqpuicH5Z5GaQ5j_XIrEAsNvKlMvHAeAzCfRa2o8DjDHHOW0C0lTxDR0SZr01cyINXRzHl22bhxU8vvrqcPFQ8");'></div>
<div class="h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-medium">+2</div>
</div>
</td>
<td class="p-4">
<div class="flex items-center gap-1.5">
<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
<span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</span>
</div>
</td>
<td class="p-4 text-center">
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
<!-- Row 2 -->
<tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td class="p-4">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</td>
<td class="p-4">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                                                JD
                                            </div>
<div class="flex flex-col">
<span class="text-sm font-semibold text-slate-900 dark:text-white">Rakshit Gajera</span>
<span class="text-xs text-slate-500 dark:text-slate-400">john.doe@student.uni.edu</span>
</div>
</div>
</td>
<td class="p-4 hidden sm:table-cell">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                            Student
                                        </span>
</td>
<td class="p-4 hidden md:table-cell">
<span class="text-sm text-slate-600 dark:text-slate-300">Engineering</span>
</td>
<td class="p-4 hidden lg:table-cell">
<div class="flex items-center gap-2">
<div class="h-6 w-6 rounded-full bg-cover" data-alt="Mentor for Rakshit Gajera" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgVGYSZoTl6O34QURkse1yOrKPXbwnE5xlGkZYcLn0LARD5CHu-BJUUbUjzm2v6-VPpxKPrCHHXUMYy1aKnCd-DDX-5zpom09ISld0eOhJuRUUnYmYwRjL230Dwf3HzwIJc7koRiRgUDYDaQk13eZJZ83gqs7NhqHH4_d7Fu8ppJtWmleOuFTeizguj5gjGWV-wQbtIST5iSdxhby83SPQVRUd7bphDOdQPow7UxHB9WFQO1YT1EKBiaqiONSFUUapau8BNWDa_38");'></div>
<span class="text-xs text-slate-500">Prof. Alan Turing</span>
</div>
</td>
<td class="p-4">
<div class="flex items-center gap-1.5">
<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
<span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</span>
</div>
</td>
<td class="p-4 text-center">
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
<!-- Row 3 -->
<tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td class="p-4">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</td>
<td class="p-4">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" data-alt="Portrait of Jane Smith" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnM12XvZwaPjSri4Eh6TtKGl2jHJ-ymhCHPUaFnGRd89W6YUxpH22XMUmz3-tXSNpyWSyugGbZM8TrNvcw6x-0A7KucztbK1wx3COtu4cPz0xXaprtwAAChjumzRmfDiqFFZfnxkN4bpSuruHPkiHvRlaS5jVyw4rsmlw9slSpWKJIWYMySOrH5ZQoaGSkyklcb3vhtFy8r_ZOgL2sddGfVfAqnWcUOyTvIUJcIYt2rNMF3NYPZLx2nFdOuPdP7vMu_epLDcQmuyg");'></div>
<div class="flex flex-col">
<span class="text-sm font-semibold text-slate-900 dark:text-white">Jane Smith</span>
<span class="text-xs text-slate-500 dark:text-slate-400">jane.smith@student.uni.edu</span>
</div>
</div>
</td>
<td class="p-4 hidden sm:table-cell">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                            Student
                                        </span>
</td>
<td class="p-4 hidden md:table-cell">
<span class="text-sm text-slate-600 dark:text-slate-300">Arts &amp; Design</span>
</td>
<td class="p-4 hidden lg:table-cell">
<span class="text-xs text-orange-500 font-medium bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">Unassigned</span>
</td>
<td class="p-4">
<div class="flex items-center gap-1.5">
<div class="h-2 w-2 rounded-full bg-slate-400"></div>
<span class="text-sm font-medium text-slate-500 dark:text-slate-400">Inactive</span>
</div>
</td>
<td class="p-4 text-center">
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
<!-- Row 4 -->
<tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td class="p-4">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</td>
<td class="p-4">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex-shrink-0 flex items-center justify-center text-amber-700 dark:text-amber-500 font-bold text-sm">
                                                RM
                                            </div>
<div class="flex flex-col">
<span class="text-sm font-semibold text-slate-900 dark:text-white">Robert Miller</span>
<span class="text-xs text-slate-500 dark:text-slate-400">r.miller@uni.edu</span>
</div>
</div>
</td>
<td class="p-4 hidden sm:table-cell">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                            Admin
                                        </span>
</td>
<td class="p-4 hidden md:table-cell">
<span class="text-sm text-slate-600 dark:text-slate-300">Administration</span>
</td>
<td class="p-4 hidden lg:table-cell">
<span class="text-xs text-slate-400">-</span>
</td>
<td class="p-4">
<div class="flex items-center gap-1.5">
<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
<span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</span>
</div>
</td>
<td class="p-4 text-center">
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
<!-- Row 5 -->
<tr class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td class="p-4">
<input class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox"/>
</td>
<td class="p-4">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" data-alt="Portrait of Emily Chen" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBG2vJcRsieHd5Eiw6GENhSYIJmIHASLK103qbE6cjvPVgcs2tSb9AaM-Li9txW1jpOOc1uvqmYJi_dRMZTxesQ3d4BvABHtuJGCE_Dn8Atn_00tlGb5DgllVJLNSjE2QMpdHjravca0VU6tbRNSliFWsrz5DcB-oCQiZCFBP6aW38sO-xI8lzbHhBejpn2c9A3QV9jpUjBv5iu_60lX7FmUKYVH6fshjJspG65RrZ4a7O3a06365KdvrOmJNV_uHWTz4ZvYTETXoo");'></div>
<div class="flex flex-col">
<span class="text-sm font-semibold text-slate-900 dark:text-white">Emily Chen</span>
<span class="text-xs text-slate-500 dark:text-slate-400">e.chen@uni.edu</span>
</div>
</div>
</td>
<td class="p-4 hidden sm:table-cell">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            Mentor
                                        </span>
</td>
<td class="p-4 hidden md:table-cell">
<span class="text-sm text-slate-600 dark:text-slate-300">Physics</span>
</td>
<td class="p-4 hidden lg:table-cell">
<div class="flex -space-x-2 overflow-hidden">
<div class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover" data-alt="Mentee student 4" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFwIO9_EWNdupawKCHe2OAtno--8EghcZh8JZolaqB0WsRmuhEsNk6DoWjl3O_7ZKI3G3BKobJBUZoV5CKLxn3lJzYMwXYkCByBOjbikJsepiujd85dtG0sitnXTnu9P7a9vWPvIcNlVqSt9Tq0PFWcWpjgbAz45jVS9cos4MZSmOqmfGKDteMXsqPsG-B1Elv_dgftXz2J_wM22jR5sGFpJfGXgaojUEYeSYA6kHcdc1RJvIms98PiT-NmozA4pNKP8IuxA2fBHA");'></div>
</div>
</td>
<td class="p-4">
<div class="flex items-center gap-1.5">
<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
<span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</span>
</div>
</td>
<td class="p-4 text-center">
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination -->
<div class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
<div class="flex-1 flex justify-between sm:hidden">
<a class="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50" href="#">Previous</a>
<a class="relative ml-3 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50" href="#">Next</a>
</div>
<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
<div>
<p class="text-sm text-slate-700 dark:text-slate-400">
                                    Showing <span class="font-medium text-slate-900 dark:text-white">1</span> to <span class="font-medium text-slate-900 dark:text-white">10</span> of <span class="font-medium text-slate-900 dark:text-white">128</span> results
                                </p>
</div>
<div>
<nav aria-label="Pagination" class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
<a class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700" href="#">
<span class="sr-only">Previous</span>
<span class="material-symbols-outlined text-[20px]">chevron_left</span>
</a>
<!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
<a aria-current="page" class="z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">1</a>
<a class="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">2</a>
<a class="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">3</a>
<span class="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-400">...</span>
<a class="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium" href="#">8</a>
<a class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700" href="#">
<span class="sr-only">Next</span>
<span class="material-symbols-outlined text-[20px]">chevron_right</span>
</a>
</nav>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>