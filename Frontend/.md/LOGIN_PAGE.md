### LOGIN SCREEN CODE:

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SMMS - Mentor-wise Mentee Report</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#135bec",
                        "primary-dark": "#0f4bc2",
                        "background-light": "#f6f6f8",
                        "background-dark": "#101622",
                        "surface-light": "#ffffff",
                        "surface-dark": "#1a2233",
                        "border-light": "#e5e7eb",
                        "border-dark": "#2d3748",
                        "text-main-light": "#0d121b",
                        "text-main-dark": "#ffffff",
                        "text-secondary-light": "#4c669a",
                        "text-secondary-dark": "#94a3b8",
                    },
                    fontFamily: {
                        "display": ["Lexend", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                },
            },
        }
    </script>
<style>
        /* Custom scrollbar for cleaner look */
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
            background: #475569;
        }
        
        /* Pie Chart Conic Gradient */
        .pie-chart {
            background: conic-gradient(
                #135bec 0% 65%, 
                #60a5fa 65% 85%, 
                #e2e8f0 85% 100%
            );
        }
        .dark .pie-chart {
            background: conic-gradient(
                #135bec 0% 65%, 
                #60a5fa 65% 85%, 
                #334155 85% 100%
            );
        }
    </style>
</head>
<body class="font-display bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark overflow-hidden">
<div class="flex h-screen w-full">
<!-- Sidebar -->
<aside class="w-64 flex-shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col justify-between overflow-y-auto hidden md:flex z-20">
<div class="flex flex-col gap-6 p-6">
<!-- Profile/Brand -->
<div class="flex gap-4 items-center">
<div class="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm ring-2 ring-primary/20" data-alt="Profile picture of the system administrator" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCb7C7gX-CrJ9D23uC_l-K5or7nfWKQzWJuAPy9vSIO1YcRTjE05vEen2krqngwJMufddawQxEv_WTNPmwvJAX1MDo4pzfeJ-at8gXfCyEBCh459bmruFpv8LE6cae4KeWXVMzJT0ssRhr5cDvOgvXRfixh8iTJBSjbuFHFx8kbvGFcGMzv7U9xRbbmt1Uv26SrnjtwMgs292wkkQD2j189RLAqEA-Wlc_cD5sXR8cYTXi50SlVDxY_0ipLP5Xt42rUJR9IR68kECq5");'>
</div>
<div class="flex flex-col">
<h1 class="text-base font-bold leading-tight">SMMS Admin</h1>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-xs">Super Admin</p>
</div>
</div>
<!-- Navigation -->
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">dashboard</span>
<span class="text-sm font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">school</span>
<span class="text-sm font-medium">Mentors</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">group</span>
<span class="text-sm font-medium">Students</span>
</a>
<!-- Active State -->
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-blue-400" href="#">
<span class="material-symbols-outlined text-2xl fill-1">analytics</span>
<span class="text-sm font-bold">Reports</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined text-2xl">settings</span>
<span class="text-sm font-medium">Settings</span>
</a>
</nav>
</div>
<!-- Bottom Action -->
<div class="p-6 border-t border-border-light dark:border-border-dark">
<button class="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg w-full transition-colors">
<span class="material-symbols-outlined text-2xl">logout</span>
<span class="text-sm font-medium">Log Out</span>
</button>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 flex flex-col h-full overflow-hidden relative">
<!-- Mobile Header -->
<header class="md:hidden h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4">
<span class="material-symbols-outlined text-2xl">menu</span>
<span class="font-bold text-lg">SMMS Reports</span>
<div class="size-8 rounded-full bg-slate-200"></div>
</header>
<div class="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 scroll-smooth">
<div class="max-w-7xl mx-auto flex flex-col gap-8">
<!-- Page Header & Actions -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div class="flex flex-col gap-2">
<h2 class="text-3xl md:text-4xl font-black text-text-main-light dark:text-text-main-dark tracking-tight">Mentor-wise Report</h2>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-base">Analytics and performance tracking for mentorship programs.</p>
</div>
<div class="flex gap-3">
<button class="flex items-center gap-2 h-10 px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-bold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
<span class="material-symbols-outlined text-lg">picture_as_pdf</span>
                                Export PDF
                            </button>
<button class="flex items-center gap-2 h-10 px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-bold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
<span class="material-symbols-outlined text-lg">table_view</span>
                                Export Excel
                            </button>
</div>
</div>
<!-- Filter Section -->
<div class="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark">
<div class="flex flex-col lg:flex-row gap-4 items-end">
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
<label class="flex flex-col gap-1.5">
<span class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Department</span>
<div class="relative">
<select class="w-full h-11 pl-3 pr-10 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer">
<option>All Departments</option>
<option>Computer Science</option>
<option>Mechanical Eng.</option>
<option>Business Admin</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-text-secondary-light">expand_more</span>
</div>
</label>
<label class="flex flex-col gap-1.5">
<span class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Mentor Name</span>
<div class="relative">
<input class="w-full h-11 pl-3 pr-10 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Search mentor..." type="text"/>
<span class="material-symbols-outlined absolute right-3 top-2.5 text-text-secondary-light">search</span>
</div>
</label>
<label class="flex flex-col gap-1.5">
<span class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Academic Year</span>
<div class="relative">
<select class="w-full h-11 pl-3 pr-10 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer">
<option>2023 - 2024</option>
<option>2022 - 2023</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-text-secondary-light">calendar_today</span>
</div>
</label>
</div>
<button class="h-11 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 min-w-[140px]">
<span class="material-symbols-outlined text-lg">filter_alt</span>
                                Apply Filters
                            </button>
</div>
</div>
<!-- KPI Summary Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<div class="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between group hover:border-primary/50 transition-colors">
<div>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium mb-1">Total Mentors</p>
<h3 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">48</h3>
<p class="text-green-600 text-xs font-medium mt-1 flex items-center gap-1">
<span class="material-symbols-outlined text-sm">trending_up</span> +2 this month
                                </p>
</div>
<div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
<span class="material-symbols-outlined">school</span>
</div>
</div>
<div class="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between group hover:border-primary/50 transition-colors">
<div>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium mb-1">Active Mentees</p>
<h3 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">850</h3>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-1">~17 per mentor</p>
</div>
<div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
<span class="material-symbols-outlined">groups</span>
</div>
</div>
<div class="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between group hover:border-primary/50 transition-colors">
<div>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium mb-1">Meetings Done</p>
<h3 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">1,204</h3>
<p class="text-green-600 text-xs font-medium mt-1 flex items-center gap-1">
<span class="material-symbols-outlined text-sm">arrow_upward</span> 12% vs last sem
                                </p>
</div>
<div class="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
<span class="material-symbols-outlined">event_available</span>
</div>
</div>
<div class="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between group hover:border-primary/50 transition-colors">
<div>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium mb-1">Avg. Progress</p>
<h3 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">88%</h3>
<p class="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-1">Based on goals met</p>
</div>
<div class="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600">
<span class="material-symbols-outlined">donut_large</span>
</div>
</div>
</div>
<!-- Charts Area -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<!-- Bar Chart: Mentees per Department -->
<div class="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-bold text-text-main-light dark:text-text-main-dark">Mentee Allocation by Dept</h3>
<button class="text-primary text-sm font-medium hover:underline">View Details</button>
</div>
<div class="flex-1 flex items-end justify-between gap-4 h-64 px-2 pb-2">
<!-- Bar 1 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 85%;"></div>
<div class="absolute top-0 w-full h-full flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
<span class="text-xs font-bold text-white drop-shadow-md">85%</span>
</div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">CS</span>
</div>
<!-- Bar 2 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 65%;"></div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Mech</span>
</div>
<!-- Bar 3 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 45%;"></div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Civil</span>
</div>
<!-- Bar 4 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 75%;"></div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Elec</span>
</div>
<!-- Bar 5 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 55%;"></div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Bio</span>
</div>
<!-- Bar 6 -->
<div class="flex flex-col items-center gap-2 flex-1 group">
<div class="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg relative h-full flex items-end overflow-hidden">
<div class="w-full bg-primary group-hover:bg-primary-dark transition-all duration-500 rounded-t-lg" style="height: 30%;"></div>
</div>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Arts</span>
</div>
</div>
</div>
<!-- Pie Chart: Progress Status -->
<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
<h3 class="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-6">Mentorship Status</h3>
<div class="flex-1 flex flex-col items-center justify-center gap-6">
<div class="relative size-48 rounded-full pie-chart flex items-center justify-center shadow-inner">
<div class="size-32 rounded-full bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center z-10 shadow-sm">
<span class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">850</span>
<span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Total Mentees</span>
</div>
</div>
<div class="w-full flex justify-center gap-4 text-xs font-medium">
<div class="flex items-center gap-2">
<div class="size-3 rounded-full bg-primary"></div>
<span class="text-text-secondary-light dark:text-text-secondary-dark">On Track (65%)</span>
</div>
<div class="flex items-center gap-2">
<div class="size-3 rounded-full bg-blue-400"></div>
<span class="text-text-secondary-light dark:text-text-secondary-dark">Monitor (20%)</span>
</div>
<div class="flex items-center gap-2">
<div class="size-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
<span class="text-text-secondary-light dark:text-text-secondary-dark">Inactive (15%)</span>
</div>
</div>
</div>
</div>
</div>
<!-- Data Table -->
<div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden mb-12">
<div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
<h3 class="font-bold text-text-main-light dark:text-text-main-dark">Detailed Mentor List</h3>
<button class="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                SEE ALL <span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="text-xs font-semibold tracking-wide text-text-secondary-light dark:text-text-secondary-dark uppercase border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
<th class="px-6 py-4">Mentor Name</th>
<th class="px-6 py-4">Department</th>
<th class="px-6 py-4 text-center">Mentees</th>
<th class="px-6 py-4">Progress</th>
<th class="px-6 py-4">Last Meeting</th>
<th class="px-6 py-4 text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-border-light dark:divide-border-dark">
<!-- Row 1 -->
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="size-9 rounded-full bg-cover bg-center" data-alt="Portrait of Dr. Sarah Smith" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvC0xqEc1QpQOOlsAoewBe7d-9qha9e4nwnbiAm5HslSCex2Zh8HAJc1is-WYM9El3aM24pksRFCSVWbQPIaF-KZBEx-NHviOjO2P6JoACjc2hDuGDg9aGmuZAi1DuyZDoLXSz9OxepepU-qPuhO9BDRQzKNCsamOgJJrQDBQB1rsBhb4bqBFj9jGL4lIXeDSeQii5BODBnpvmlkZN8nv3vcKNNYW9ixZ_X_iVYZONCHSiLgszzsup_00wTwOBDMclg6P3QLE2zZPu");'></div>
<div>
<p class="font-bold text-sm text-text-main-light dark:text-text-main-dark">Dr. Sarah Smith</p>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Senior Lecturer</p>
</div>
</div>
</td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                Comp. Sci.
                                            </span>
</td>
<td class="px-6 py-4 text-center text-sm text-text-main-light dark:text-text-main-dark font-medium">12</td>
<td class="px-6 py-4">
<div class="w-full max-w-[120px]">
<div class="flex justify-between text-xs mb-1">
<span class="font-medium text-green-600">95%</span>
</div>
<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
<div class="bg-green-500 h-1.5 rounded-full" style="width: 95%"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            Oct 24, 2023
                                        </td>
<td class="px-6 py-4 text-right">
<button class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors p-1">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="size-9 rounded-full bg-cover bg-center" data-alt="Portrait of Prof. Rakshit Gajera" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZ2bWt0qfyVYNC0CvgBkWOhfFWXFWcc67-hk3t4oJ1BA5ZNJN15CQr0aGJ5YZtwm_mR1i6r3uOcbn4gXfmKmquFSS7F0vpgQOBbsea7UdhEUC_luNLsUtq3G6c60fksgHqoeXxerleYJAN3ehAfi7NsXbtFuBxPnpcfvd3FxXJTVV5Un2q1WCjEoGS_KsFxdsDJnnLtOx2UA9zgWjVnhT6ZrJGGVrkdEzJe5fU0m5Ne3ZrCaUqCFsiC6PZwj2MKfWZWVu8hqeMHFRQ");'></div>
<div>
<p class="font-bold text-sm text-text-main-light dark:text-text-main-dark">Prof. Rakshit Gajera</p>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Asst. Professor</p>
</div>
</div>
</td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                                Mech. Eng
                                            </span>
</td>
<td class="px-6 py-4 text-center text-sm text-text-main-light dark:text-text-main-dark font-medium">10</td>
<td class="px-6 py-4">
<div class="w-full max-w-[120px]">
<div class="flex justify-between text-xs mb-1">
<span class="font-medium text-primary">88%</span>
</div>
<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
<div class="bg-primary h-1.5 rounded-full" style="width: 88%"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            Oct 22, 2023
                                        </td>
<td class="px-6 py-4 text-right">
<button class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors p-1">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="size-9 rounded-full bg-cover bg-center" data-alt="Portrait of Dr. Emily Chen" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjaxbHK_UYeOYsvJzHseltS7J4QJhL_jRbp-fPwUmBwiPopHfQrFoxlEKd7i8bLBiDBFIp7f98Tqjku-_bsQyZXAJ7cOAJyyR_LEqgunYrYE4omZz85Lkm8DwHxjeNhJmT4q8jUhdq3jy2mfkWmNqut4m8NgPe2b0cs8GP-P0yPyxTFrEAawHa5HA3qJCKhmjd-Hfdo_JrqPL8aW5eaoZnobUfyBkOcnKMk2y50JVyb9uv3i21I6TeIP5tnS0um8RrRLMs1nFk_tDV");'></div>
<div>
<p class="font-bold text-sm text-text-main-light dark:text-text-main-dark">Dr. Emily Chen</p>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">HOD</p>
</div>
</div>
</td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                Business
                                            </span>
</td>
<td class="px-6 py-4 text-center text-sm text-text-main-light dark:text-text-main-dark font-medium">15</td>
<td class="px-6 py-4">
<div class="w-full max-w-[120px]">
<div class="flex justify-between text-xs mb-1">
<span class="font-medium text-yellow-600">72%</span>
</div>
<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
<div class="bg-yellow-500 h-1.5 rounded-full" style="width: 72%"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            Oct 20, 2023
                                        </td>
<td class="px-6 py-4 text-right">
<button class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors p-1">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="size-9 rounded-full bg-cover bg-center" data-alt="Portrait of Mr. David Kim" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEbvoBp-d0uVBo81SZzYFr79u5l-8lBycNZ3bn1PAjRdQowjjfBUG5NTPjduCvHxPL9Zv-9gxDhHNB5OMcgqjDWul0yIkgBHehmRyIdL2D98v4rW-YHeJAKFdXgKc5yl8ZEvlGAIzosSvO8Nv0pNS2tC0GSpJjW0Pp5t92hZoDK92FSlV7yAkiLFSQyx36Vp7mMNyJZfZQT1qgjBGv4hpdiuYojimq70a229wcFvEE4bPilTsI1f4_noND3p5DNSb6zT3igfQLD3rK");'></div>
<div>
<p class="font-bold text-sm text-text-main-light dark:text-text-main-dark">Mr. David Kim</p>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Lecturer</p>
</div>
</div>
</td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                Arts
                                            </span>
</td>
<td class="px-6 py-4 text-center text-sm text-text-main-light dark:text-text-main-dark font-medium">8</td>
<td class="px-6 py-4">
<div class="w-full max-w-[120px]">
<div class="flex justify-between text-xs mb-1">
<span class="font-medium text-primary">82%</span>
</div>
<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
<div class="bg-primary h-1.5 rounded-full" style="width: 82%"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                            Oct 18, 2023
                                        </td>
<td class="px-6 py-4 text-right">
<button class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors p-1">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div class="px-6 py-4 border-t border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/20 flex justify-between items-center">
<span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Showing 4 of 48 mentors</span>
<div class="flex gap-2">
<button class="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button class="size-8 rounded bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">1</button>
<button class="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">2</button>
<button class="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">3</button>
<span class="flex items-center text-text-secondary-light dark:text-text-secondary-dark">...</span>
<button class="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>


