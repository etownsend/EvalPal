// Text of each of the questions asked
this.questions = [
"Quality of Courses Taught by this Professor",
"Quality of Teaching",
"Professor's Organization",
"Use of Class Time",
"Availability Outside of Class",
"Clarity of Evaluation Guidelines",
"Amount Learned in Courses Taught by this Professor"
]

// Holds thresholds for competitively ranking instructors on a
// scale of 1-10 for each of the 7 questions.
this.questionBenchmarks = [
[3.73, 3.85, 3.95, 4.05, 4.17, 4.23, 4.33, 4.47, 4.57],
[3.65, 3.81, 3.95, 4.10, 4.20, 4.30, 4.43, 4.52, 4.63],
[3.60, 3.84, 3.99, 4.05, 4.16, 4.20, 4.30, 4.43, 4.53],
[3.57, 3.81, 3.99, 4.10, 4.16, 4.21, 4.30, 4.43, 4.55],
[3.88, 4.01, 4.12, 4.23, 4.30, 4.40, 4.48, 4.56, 4.65],
[3.60, 3.88, 4.00, 4.05, 4.15, 4.20, 4.30, 4.46, 4.60],
[3.68, 3.78, 3.90, 4.02, 4.15, 4.22, 4.30, 4.40, 4.60]
];

// Hash table of the University's various departments and their abbreviations
this.dept = {};
dept['AA'] = "Allied Arts";
dept['AAA'] = "Architecture & Allied Arts";
dept['AAAP'] = "Historic Preservation";
dept['AAD'] = "Arts & Administration";
dept['ACTG'] = "Accounting";
dept['AEIS'] = "Acad Eng for Intl Stu";
dept['AFR'] = "African Studies";
dept['AIM'] = "Applied Information Management";
dept['ANTH'] = "Anthropology";
dept['ARB'] = "Arabic";
dept['ARCH'] = "Architecture";
dept['ARH'] = "Art History";
dept['ART'] = "Art";
dept['ARTC'] = "Ceramics";
dept['ARTD'] = "Digital Arts";
dept['ARTF'] = "Fibers";
dept['ARTM'] = "Metalsmithing & Jewelry";
dept['ARTO'] = "Photography";
dept['ARTP'] = "Painting";
dept['ARTR'] = "Printmaking";
dept['ARTS'] = "Sculpture";
dept['ASIA'] = "Asian Studies";
dept['ASL'] = "American Sign Language";
dept['ASTR'] = "Astronomy";
dept['BA'] = "Business Administration";
dept['BE'] = "Business Environment";
dept['BI'] = "Biology";
dept['CARC'] = "Career Center";
dept['CAS'] = "College of Arts & Sciences";
dept['CDS'] = "Communication Disorders & Sci";
dept['CFT'] = "Couples & Family Therapy";
dept['CH'] = "Chemistry";
dept['CHN'] = "Chinese";
dept['CHNF'] = "Chinese Flagship";
dept['CINE'] = "Cinema Studies";
dept['CIS'] = "Computer & Information Science";
dept['CIT'] = "Computer Information Tech";
dept['CLAS'] = "Classics";
dept['COLT'] = "Comparative Literature";
dept['CPSY'] = "Counseling Psychology";
dept['CRES'] = "Conflict & Dispute Resolution";
dept['CRWR'] = "Creative Writing";
dept['CSCH'] = "College Scholars";
dept['DAN'] = "Dance Professional";
dept['DANC'] = "Dance Activity";
dept['DANE'] = "Danish";
dept['DIST'] = "Distance Education";
dept['DSC'] = "Decision Sciences";
dept['EALL'] = "East Asian Lang & Literature";
dept['EC'] = "Economics";
dept['EDLD'] = "Educational Leadership";
dept['EDST'] = "Education Studies";
dept['EDUC'] = "Education";
dept['ENG'] = "English";
dept['ENVS'] = "Environmental Studies";
dept['ES'] = "Ethnic Studies";
dept['ESC'] = "Community Internship Program";
dept['EURO'] = "European Studies";
dept['FHS'] = "Family & Human Services";
dept['FIN'] = "Finance";
dept['FINN'] = "Finnish";
dept['FLR'] = "Folklore";
dept['FR'] = "French";
dept['FSEM'] = "Freshman Seminar";
dept['GEOG'] = "Geography";
dept['GEOL'] = "Geology";
dept['GER'] = "German";
dept['GRK'] = "Greek";
dept['GSS'] = "General Social Science";
dept['HBRW'] = "Hebrew";
dept['HC'] = "Honors College";
dept['HIST'] = "History";
dept['HPHY'] = "Human Physiology";
dept['HUM'] = "Humanities";
dept['IARC'] = "Interior Architecture";
dept['INTL'] = "International Studies";
dept['IST'] = "Interdisciplinary Studies";
dept['ITAL'] = "Italian";
dept['J'] = "Journalism";
dept['JDST'] = "Judaic Studies";
dept['JGS'] = "Japanese Global Scholars";
dept['JPN'] = "Japanese";
dept['KRN'] = "Korean";
dept['LA'] = "Landscape Architecture";
dept['LAS'] = "Latin American Studies";
dept['LAT'] = "Latin";
dept['LAW'] = "Law";
dept['LEAD'] = "Leadership Development";
dept['LERC'] = "Labor Educ & Research Center";
dept['LIB'] = "Library";
dept['LING'] = "Linguistics";
dept['LT'] = "Language Teaching";
dept['MATH'] = "Mathematics";
dept['MDVL'] = "Medieval Studies";
dept['MGMT'] = "Management";
dept['MIL'] = "Military Science";
dept['MKTG'] = "Marketing";
dept['MUE'] = "Music Education";
dept['MUJ'] = "Music Jazz Studies";
dept['MUP'] = "Music Performance";
dept['MUS'] = "Music";
dept['NAS'] = "Native American Studies";
dept['NORW'] = "Norwegian";
dept['OIMB'] = "Oregon Inst of Marine Biology";
dept['OLIS'] = "Oregon Ldrship Sustainability";
dept['PD'] = "Product Design";
dept['PDX'] = "UO Portland Programs";
dept['PEAE'] = "PE Aerobics";
dept['PEAQ'] = "PE Aquatics";
dept['PEAS'] = "PE SCUBA";
dept['PEC'] = "PE Certification";
dept['PEF'] = "PE Fitness";
dept['PEI'] = "PE Individual Activities";
dept['PEIA'] = "PE Intercollegiate Athletics";
dept['PEL'] = "PE Leadership";
dept['PEMA'] = "PE Martial Arts";
dept['PEMB'] = "PE Mind-Body";
dept['PEO'] = "PE Outdoor Pursuits";
dept['PEOL'] = "PE Outdoor Pursuits - Land";
dept['PEOW'] = "PE Outdoor Pursuits - Water";
dept['PERS'] = "PE Racquet Sports";
dept['PERU'] = "PE Running";
dept['PETS'] = "PE Team Sports";
dept['PEW'] = "PE Weight Training";
dept['PHIL'] = "Philosophy";
dept['PHYS'] = "Physics";
dept['PORT'] = "Portuguese";
dept['PPPM'] = "Planning Public Policy Mgmt";
dept['PS'] = "Political Science";
dept['PSY'] = "Psychology";
dept['REES'] = "Russ, E Euro & Eurasia Studies";
dept['REL'] = "Religious Studies";
dept['RL'] = "Romance Languages";
dept['RUSS'] = "Russian";
dept['SAPP'] = "Substance Abuse Prev Prog";
dept['SBUS'] = "Sports Business";
dept['SCAN'] = "Scandinavian";
dept['SCYP'] = "Sustainable City Year Program";
dept['SERV'] = "Service Learning";
dept['SOC'] = "Sociology";
dept['SPAN'] = "Spanish";
dept['SPED'] = "Special Education";
dept['SPSY'] = "School Psychology";
dept['SWAH'] = "Swahili";
dept['SWED'] = "Swedish";
dept['TA'] = "Theater Arts";
dept['TLC'] = "Univ Teaching & Learning Ctr";
dept['WGS'] = "Women's & Gender Studies";
dept['WR'] = "Writing";