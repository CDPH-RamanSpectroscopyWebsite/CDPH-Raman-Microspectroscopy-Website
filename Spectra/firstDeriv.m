function [x, y] = firstDeriv(xIn, yIn)
% Takes a plots X and Y column vectors as inputs and returns the
% first derivative plot.
%
% NOTE: The returned column vectors are smaller than the inputs
% by exactly one as the derivative is calculated by taking a difference
% between adjacent points.

x = zeros(1, length(xIn)-1);
y = zeros(1, length(yIn)-1);
for i=1:length(xIn)-1
    x(i) = xIn(i);
    y(i) = yIn(i+1) - yIn(i);
end

end

