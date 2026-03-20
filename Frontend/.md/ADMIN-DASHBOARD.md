### ADMIN-DASHBOARD

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Login - Student Mentoring Portal</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&amp;family=Noto+Sans:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
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
                        "body": ["Noto Sans", "sans-serif"],
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
</head>
<body class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200">
<div class="layout-container flex h-full grow flex-col items-center justify-center p-4">
<!-- Main Card -->
<div class="w-full max-w-[480px] rounded-xl bg-white dark:bg-[#1a2230] shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
<!-- Header Section -->
<div class="flex flex-col gap-2 p-8 pb-4 text-center">
<div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
<span class="material-symbols-outlined text-[32px]">school</span>
</div>
<h1 class="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Student Mentoring Portal</h1>
<p class="text-sm font-normal text-slate-500 dark:text-slate-400">Please sign in to access your dashboard</p>
</div>
<!-- Role Selector -->
<div class="px-8 py-2">
<div class="flex h-12 w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-[#111824] p-1">
<label class="group flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-[#232d3d] has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-white text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
<span class="truncate text-sm font-medium">Admin</span>
<input class="invisible w-0" name="user_role" type="radio" value="Admin"/>
</label>
<label class="group flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-[#232d3d] has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-white text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
<span class="truncate text-sm font-medium">Mentor</span>
<input class="invisible w-0" name="user_role" type="radio" value="Mentor"/>
</label>
<label class="group flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-[#232d3d] has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-white text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
<span class="truncate text-sm font-medium">Student</span>
<input checked="" class="invisible w-0" name="user_role" type="radio" value="Student"/>
</label>
</div>
</div>
<!-- Login Form -->
<div class="flex flex-col gap-5 px-8 py-6">
<!-- Username Field -->
<label class="flex flex-col gap-1.5">
<p class="text-sm font-medium text-slate-900 dark:text-slate-200">Username or Email ID</p>
<div class="flex w-full items-stretch rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-primary transition-shadow">
<input class="flex-1 border-none bg-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500" placeholder="Enter your ID or email" type="text"/>
<div class="flex items-center justify-center px-4 text-slate-400 dark:text-slate-500">
<span class="material-symbols-outlined">account_circle</span>
</div>
</div>
</label>
<!-- Password Field -->
<label class="flex flex-col gap-1.5">
<div class="flex justify-between items-center">
<p class="text-sm font-medium text-slate-900 dark:text-slate-200">Password</p>
</div>
<div class="flex w-full items-stretch rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-primary transition-shadow">
<input class="flex-1 border-none bg-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500" placeholder="Enter your password" type="password"/>
<div class="flex items-center justify-center px-4 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
<span class="material-symbols-outlined">visibility_off</span>
</div>
</div>
<div class="flex justify-end mt-1">
<a class="text-sm font-medium text-primary hover:text-blue-600 hover:underline" href="#">Forgot password?</a>
</div>
</label>
<!-- Login Button -->
<button class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all">
<span>Log In</span>
</button>
<!-- Helper Links -->
<div class="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                    Need help? <a class="font-medium text-slate-900 dark:text-slate-200 hover:underline" href="#">Contact Administrator</a>
</div>
</div>
<!-- Bottom Decoration/Info -->
<div class="bg-slate-50 dark:bg-[#151b26] px-8 py-4 text-center border-t border-slate-100 dark:border-slate-800">
<p class="text-xs text-slate-400 dark:text-slate-500">Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.</p>
</div>
</div>
<!-- Footer Info -->
<div class="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
<p>© 2024 University Student Mentoring System. All rights reserved.</p>
</div>
</div>
</body></html>