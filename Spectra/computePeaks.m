function [peaksx, peaksy] = computePeaks(x, y)
% Takes x, y column vectors as the input spectra
% Returns the peaks and associated heights

[x1, y1] = firstDeriv(x, y);

noise = std(y1);
peaksx = [];
peaksy = [];
currMaxValid = false; currMax = 0;
currZeroPt = 2;
for i = 2:length(y1)
     if and(y1(i) > noise, not(currMaxValid))
        currMaxValid = true;
        currMax = y1(i);
     elseif and(y1(i-1) >= 0, y1(i) < 0)
         currZeroPt = i+1;
     elseif and(currMaxValid, y1(i) > y1(i-1))
        if currMax - y1(i-1) > 1.5*noise
            peaksx(end+1) = x1(currZeroPt-1);
            peaksy(end+1) = abs(currMax - y(i-1));
        end
        currMaxValid = false;
     end
end


end

