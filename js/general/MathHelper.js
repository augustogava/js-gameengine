class MathHelper {
    /**
     * To find the value of X within the specified range, you can use linear interpolation. Given two points (0, -50) and (1000, 50), you can find the equation of the * * line that passes through these two points and use it to find X for any value of Y within the range.
     */
    static getLinerInterpolation (finder, init, initV,  max, maxV){
       return   (maxV - (initV)) / (max - init) * (finder - init) + ( initV );
    }

      
}