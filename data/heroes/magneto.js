function init(hero) {
    // 📝 ИНФОРМАЦИЯ О ГЕРОЕ
    hero.setName("Magneto");
    hero.setVersion("Marvel");
    hero.setTier(8);
    
    // 👕 БРОНЯ
    hero.setHelmet("Head");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("Feet");

    // ⚡ СПОСОБНОСТИ (две!)
    hero.addPowers("varheroes:magnetic_powers", "varheroes:electromagnetic_field");
    
    // 💪 ХАРАКТЕРИСТИКИ
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.3, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.2, 1);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("MAX_HEALTH", 15.0, 0);

    // 🎮 КЛАВИШИ (4 основные способности)
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 1);
    hero.addKeyBind("MAGNETIC_FLIGHT", "Levitation", 2);
    hero.addKeyBind("MAGNETIC_PULSE", "Magnetic Pulse", 3);
    hero.addKeyBindFunc("func_SHIELD_TOGGLE", ShieldToggle, "Shield Toggle", 4);

    // 📏 МАСШТАБ
    hero.setDefaultScale(1.0);

    // ⚙️ ОБРАБОТЧИКИ
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTickHandler(tickHandler);

    // 🔊 ЗВУКИ
    hero.addSoundEvent("TELEKINESIS_ACTIVATE", "fiskheroes:glow_teleport");
    hero.addSoundEvent("SHIELD_ACTIVATE", "fiskheroes:flight_boost");
}

// 🔄 ОБНОВЛЕНИЕ КАЖДЫЙ ТИК
function tickHandler(entity, manager) {
    // 📈 ЛЕВИТАЦИЯ - если крадётся (SHIFT)
    if (entity.isSneaking()) {
        manager.setData(entity, "varheroes:dyn/levitating", true);
        if (!entity.isOnGround()) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    } else {
        manager.setData(entity, "varheroes:dyn/levitating", false);
    }

    // 🛡️ ЩИТ ТАЙМЕР
    if (entity.getData("varheroes:dyn/shield_active")) {
        manager.incrementData(entity, "varheroes:dyn/shield_timer", 1, 200, true);
        if (entity.getData("varheroes:dyn/shield_timer") >= 200) {
            manager.setDataWithNotify(entity, "varheroes:dyn/shield_active", false);
            manager.setData(entity, "varheroes:dyn/shield_timer", 0);
        }
    }
}

// ⚙️ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЩИТА
function ShieldToggle(entity, manager) {
    var isActive = entity.getData("varheroes:dyn/shield_active");
    
    if (!isActive) {
        manager.setDataWithNotify(entity, "varheroes:dyn/shield_active", true);
        manager.setData(entity, "varheroes:dyn/shield_timer", 0);
    } else {
        manager.setDataWithNotify(entity, "varheroes:dyn/shield_active", false);
    }
    return true;
}

// 🎛️ УПРАВЛЕНИЕ МОДИФИКАТОРАМИ
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:energy_projection":
            return !entity.getData("fiskheroes:telekinesis");
        case "fiskheroes:teleportation":
            return !entity.getData("fiskheroes:telekinesis");
        case "fiskheroes:electromagnetic_shield":
            return entity.getData("varheroes:dyn/shield_active");
        case "fiskheroes:magnetic_aura":
            return true;
        default:
            return true;
    }
}

// 🔑 УПРАВЛЕНИЕ КЛАВИШАМИ
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "TELEKINESIS":
            return entity.isAlive();
        case "MAGNETIC_FLIGHT":
            return entity.isAlive() && entity.isOnGround();
        case "MAGNETIC_PULSE":
            return entity.isAlive();
        case "func_SHIELD_TOGGLE":
            return entity.isAlive() && entity.getData("varheroes:dyn/shield_timer") == 0;
        default:
            return true;
    }
}

// 🌍 СПЕЦИАЛЬНЫЕ СВОЙСТВА
function hasProperty(entity, property) {
    return property == "MAGNETIC_FIELD";
}