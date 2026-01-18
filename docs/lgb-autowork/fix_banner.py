import codecs

# Read with UTF-8-SIG to handle BOM
with codecs.open('index.html', 'r', 'utf-8-sig') as f:
    lines = f.readlines()

# Find and replace the marquee section
new_lines = []
in_marquee = False
marquee_replaced = False

for i, line in enumerate(lines):
    if '<marquee behavior="scroll"' in line and not marquee_replaced:
        # Start of marquee section - add Spanish version
        new_lines.append('        <marquee behavior="scroll" direction="left" scrollamount="5" class="lang-es">\r\n')
        new_lines.append('            🔧 HOY NO FÍO, MAÑANA TAMPOCO 🔧 SE HABLA ESPAÑOL 🔧 PASE SIN TOCAR EL CLAXON 🔧 MECÁNICA EN GENERAL 🔧 GARANTÍA NAPA 24 MESES / 24,000 MILLAS 🔧 SI LO VISTE EN INTERNET Y ERA FACILÍSIMO, $60 MÁS 🔧 POR MIRAR, $10 MÁS 🔧 SI MIRAS Y OPINAS, $15 MÁS 🔧 SOY MECÁNICO, NO MAGO 🔧 ESPECIALISTAS EN TODO TIPO DE VEHÍCULOS 🔧 DIAGNÓSTICO COMPUTARIZADO 🔧 SERVICIO RÁPIDO Y CONFIABLE 🔧 LOS MÉDICOS DE TU AUTO 🔧 DEJAMOS TU AUTO COMO UN 0 KM 🔧 LLAVES TESLA - NUESTRA ESPECIALIDAD 🔧 TÉCNICOS CERTIFICADOS ASE 🔧 ACEPTAMOS TODAS LAS TARJETAS 🔧 ESTACIONAMIENTO GRATIS 🔧\r\n')
        new_lines.append('        </marquee>\r\n')
        # Add English version
        new_lines.append('        <marquee behavior="scroll" direction="left" scrollamount="5" class="lang-en">\r\n')
        new_lines.append('            🔧 CASH ONLY - NO CREDIT TODAY 🔧 WE SPEAK SPANISH 🔧 PLEASE, NO HONKING 🔧 FULL AUTOMOTIVE REPAIR 🔧 NAPA WARRANTY 24 MONTHS / 24,000 MILES 🔧 IF YOU SAW IT ON YOUTUBE, ADD $60 🔧 JUST LOOKING COSTS EXTRA 🔧 IF YOU LOOK AND COMMENT, EVEN MORE 🔧 I\'M A MECHANIC, NOT A MAGICIAN 🔧 SPECIALISTS IN ALL VEHICLE TYPES 🔧 COMPUTER DIAGNOSTICS 🔧 FAST & RELIABLE SERVICE 🔧 YOUR CAR\'S DOCTORS 🔧 WE\'LL MAKE YOUR CAR LIKE NEW 🔧 TESLA KEYS - OUR SPECIALTY 🔧 ASE CERTIFIED TECHNICIANS 🔧 ALL CARDS ACCEPTED 🔧 FREE PARKING 🔧\r\n')
        in_marquee = True
        marquee_replaced = True
    elif '</marquee>' in line and in_marquee:
        # End of marquee section - skip this line as we already added both </marquee> tags
        new_lines.append(line)
        in_marquee = False
    elif not in_marquee:
        new_lines.append(line)
    # Skip lines inside the original marquee (between <marquee> and </marquee>)

# Write back
with codecs.open('index.html', 'w', 'utf-8-sig') as f:
    f.writelines(new_lines)

print("✅ Banner bilingüe actualizado correctamente!")
