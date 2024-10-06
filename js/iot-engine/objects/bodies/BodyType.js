const bodyType = new HashTable();
bodyType.set('static', {mass: 0, velocity: 0, moved: 0});
bodyType.set('dynamic', {mass: 0, velocity: 1, moved: 1});
bodyType.set('kinematic', {mass: 1, velocity: 1, moved: 1});

class BodyDefType {
    constructor(bodyTypeP) {
        this.bodyType = bodyType.get(bodyTypeP);
    }
}