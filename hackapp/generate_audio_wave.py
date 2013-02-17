#coding:utf-8

import sys 

import matplotlib
# バックエンドを Agg に変更
matplotlib.use('Agg')

import wave
from numpy import *
from pylab import *


argvs = sys.argv

def printWaveInfo(wf):
    """WAVEファイルの情報を取得"""
    print "チャンネル数:", wf.getnchannels()
    print "サンプル幅:", wf.getsampwidth()
    print "サンプリング周波数:", wf.getframerate()
    print "フレーム数:", wf.getnframes()
    print "パラメータ:", wf.getparams()
    print "長さ（秒）:", float(wf.getnframes()) / wf.getframerate()

if __name__ == '__main__':
    wf = wave.open(argvs[1], "r")
    # printWaveInfo(wf)

    buffer = wf.readframes(wf.getnframes())
    # print len(buffer)  # バイト数 = 1フレーム2バイト x フレーム数

    # bufferはバイナリなので2バイトずつ整数（-32768から32767）にまとめる
    data = frombuffer(buffer, dtype="int16")

    width = float(argvs[2]) / 96
    height = float(argvs[3]) / 96
   
    import matplotlib.pyplot as plt
    
    ax = plt.gca()
    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)
    #for spine in ax.spines.itervalues():
    #    spine.set_visible(False)

    ax1 = plt.axes(frameon=False)
    ax1.set_frame_on(False)
    ax1.axes.get_yaxis().set_visible(False)
    ax1.get_xaxis().tick_bottom()
    ax1.set_frame_on(False)
    ax1.set_xticks([])
    ax1.set_yticks([])

    margins = [0.1, 0.1, 0.5, 0.8]
    #plt.margins(0,0)
    
    # axes(axisbg="#777777") # 背景

    #plt.axis('off')
    #plt.xlim(0, 100)
    #plt.ylim(w,0)

    f = plt.figure(num=None, figsize=(width,height), dpi=96, frameon=False, )
    #plt.majorticks_off()
    # プロット

    #plt.margins(0, 0)
    #plt.autoscale(tight=True)

    #ax1.set_xmargin(0)
    #ax1.set_ymargin(0)
    
    plt.plot(data, color="#777777")
    plt.axis('off')
    #plt.xlim(0, 100000)
    plt.savefig(argvs[4], bbox_inches='tight', pad_inches=0)
    #show()
